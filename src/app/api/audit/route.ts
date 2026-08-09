import { NextRequest, NextResponse } from "next/server";
import { runAudit, combineAudits, type CoreWebVitals } from "@/lib/seo-audit";

export const runtime = "nodejs";
// PageSpeed Insights is the slow leg — it runs a real Lighthouse pass.
export const maxDuration = 60;

/**
 * Fetch Core Web Vitals from Google PageSpeed Insights.
 *
 * Prefers CrUX field data (`loadingExperience`) — that's aggregated real Chrome
 * user data, and it's what Google actually ranks on. Falls back to the lab
 * Lighthouse run when a site has too little traffic to appear in CrUX, which is
 * common for the small businesses this tool is aimed at.
 *
 * Returns null on any failure. The audit degrades gracefully: the performance
 * category is simply reported as not assessed rather than scored as zero.
 */
async function fetchVitals(url: string, signal: AbortSignal): Promise<CoreWebVitals | null> {
  const key = process.env.PAGESPEED_API_KEY;
  const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  endpoint.searchParams.set("url", url);
  endpoint.searchParams.set("strategy", "mobile");
  endpoint.searchParams.set("category", "performance");
  if (key) endpoint.searchParams.set("key", key);

  try {
    const res = await fetch(endpoint.toString(), { signal });
    if (!res.ok) return null;

    const data = await res.json();

    // 1. Field data — real users, what Google ranks on.
    const field = data?.loadingExperience?.metrics;
    if (field?.LARGEST_CONTENTFUL_PAINT_MS?.percentile != null) {
      return {
        source: "field",
        lcp: field.LARGEST_CONTENTFUL_PAINT_MS.percentile / 1000,
        cls:
          field.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile != null
            ? field.CUMULATIVE_LAYOUT_SHIFT_SCORE.percentile / 100
            : undefined,
        inp: field.INTERACTION_TO_NEXT_PAINT?.percentile ?? undefined,
      };
    }

    // 2. Lab fallback.
    const audits = data?.lighthouseResult?.audits;
    if (!audits) return null;
    const perfScore = data?.lighthouseResult?.categories?.performance?.score;
    return {
      source: "lab",
      lcp: audits["largest-contentful-paint"]?.numericValue
        ? audits["largest-contentful-paint"].numericValue / 1000
        : undefined,
      cls: audits["cumulative-layout-shift"]?.numericValue ?? undefined,
      inp: audits["total-blocking-time"]?.numericValue ?? undefined,
      performanceScore: typeof perfScore === "number" ? Math.round(perfScore * 100) : undefined,
    };
  } catch {
    return null;
  }
}

/** Reject anything that isn't a plain public http(s) host. */
function normalizeUrl(raw: string): URL | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  let url: URL;
  try {
    url = new URL(withScheme);
  } catch {
    return null;
  }

  if (!["http:", "https:"].includes(url.protocol)) return null;
  if (!url.hostname.includes(".")) return null;

  // Block SSRF against internal networks — this endpoint fetches arbitrary
  // user-supplied URLs from our server, so it must not be usable as a proxy
  // into private address space or cloud metadata endpoints.
  const host = url.hostname.toLowerCase();
  const blocked =
    host === "localhost" ||
    host === "0.0.0.0" ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    /^127\./.test(host) ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
    /^169\.254\./.test(host) ||
    /^\[?::1\]?$/.test(host);
  if (blocked) return null;

  return url;
}

/** Fetch robots.txt and report both presence and whether it advertises a sitemap. */
async function fetchRobots(
  origin: string,
  signal: AbortSignal
): Promise<{ ok: boolean; declaresSitemap: boolean }> {
  try {
    const res = await fetch(`${origin}/robots.txt`, {
      signal,
      headers: { "User-Agent": "SiteBrewAuditBot/1.0 (+https://sitebrew.co)" },
    });
    if (!res.ok) return { ok: false, declaresSitemap: false };
    const text = (await res.text()).slice(0, 100_000);
    return { ok: true, declaresSitemap: /^\s*sitemap\s*:/im.test(text) };
  } catch {
    return { ok: false, declaresSitemap: false };
  }
}

/** Max pages to audit, including the entry page. Keeps us inside maxDuration. */
const MAX_PAGES = 4;

/** Pull candidate URLs from sitemap.xml. */
async function urlsFromSitemap(origin: string, signal: AbortSignal): Promise<string[]> {
  try {
    const res = await fetch(`${origin}/sitemap.xml`, {
      signal,
      headers: { "User-Agent": "SiteBrewAuditBot/1.0 (+https://sitebrew.co)" },
    });
    if (!res.ok) return [];
    const xml = (await res.text()).slice(0, 500_000);
    return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)]
      .map((m) => m[1])
      .filter((u) => u.startsWith(origin))
      // Sitemap indexes point at more sitemaps; we only want real pages here.
      .filter((u) => !/\.xml($|\?)/i.test(u));
  } catch {
    return [];
  }
}

/** Fall back to same-origin links in the page's own navigation. */
function urlsFromLinks(html: string, origin: string): string[] {
  const hrefs = [...html.matchAll(/<a[^>]+href=["']([^"'#]+)["']/gi)].map((m) => m[1]);
  const out = new Set<string>();
  for (const href of hrefs) {
    let abs: string;
    try {
      abs = new URL(href, origin).toString();
    } catch {
      continue;
    }
    if (!abs.startsWith(origin)) continue;
    // Skip assets, feeds, and anything transactional.
    if (/\.(jpg|jpeg|png|gif|webp|avif|svg|pdf|zip|mp4|css|js|ico|xml|json)($|\?)/i.test(abs)) continue;
    if (/\/(cart|checkout|login|account|search|wp-admin|wp-login)/i.test(abs)) continue;
    out.add(abs.split("#")[0].replace(/\/$/, ""));
  }
  return [...out];
}

/** Fetch a page and return its HTML, or null. */
async function fetchHtml(url: string, signal: AbortSignal): Promise<string | null> {
  try {
    const res = await fetch(url, {
      signal,
      redirect: "follow",
      headers: {
        "User-Agent": "SiteBrewAuditBot/1.0 (+https://sitebrew.co)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    if (!res.ok) return null;
    if (!(res.headers.get("content-type") ?? "").includes("html")) return null;
    return (await res.text()).slice(0, 2_000_000);
  } catch {
    return null;
  }
}

async function headOk(url: string, signal: AbortSignal): Promise<boolean> {
  try {
    const res = await fetch(url, {
      signal,
      redirect: "follow",
      headers: { "User-Agent": "SiteBrewAuditBot/1.0 (+https://sitebrew.co)" },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url: rawUrl } = (await req.json()) as { url?: string };
    if (!rawUrl) {
      return NextResponse.json({ error: "Please enter a website address." }, { status: 400 });
    }

    const url = normalizeUrl(rawUrl);
    if (!url) {
      return NextResponse.json(
        { error: "That doesn't look like a valid public website address." },
        { status: 400 }
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);

    // Kick off PageSpeed immediately — it's the long pole, so let it run while
    // we fetch and parse the HTML.
    const vitalsPromise = fetchVitals(url.toString(), controller.signal);

    let res: Response;
    try {
      res = await fetch(url.toString(), {
        signal: controller.signal,
        redirect: "follow",
        headers: {
          "User-Agent": "SiteBrewAuditBot/1.0 (+https://sitebrew.co)",
          Accept: "text/html,application/xhtml+xml",
        },
      });
    } catch {
      clearTimeout(timeout);
      return NextResponse.json(
        { error: "We couldn't reach that site. Check the address and try again." },
        { status: 502 }
      );
    }

    if (!res.ok) {
      clearTimeout(timeout);
      return NextResponse.json(
        { error: `That site returned an error (HTTP ${res.status}).` },
        { status: 502 }
      );
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("html")) {
      clearTimeout(timeout);
      return NextResponse.json(
        { error: "That address didn't return a web page we can analyse." },
        { status: 400 }
      );
    }

    const html = (await res.text()).slice(0, 2_000_000);
    const finalUrl = res.url || url.toString();
    const origin = new URL(finalUrl).origin;

    const [robots, sitemapOk, vitals] = await Promise.all([
      fetchRobots(origin, controller.signal),
      headOk(`${origin}/sitemap.xml`, controller.signal),
      vitalsPromise,
    ]);
    clearTimeout(timeout);

    const isHttps = new URL(finalUrl).protocol === "https:";
    const shared = {
      robotsTxtOk: robots.ok,
      sitemapInRobots: robots.declaresSitemap,
      sitemapOk,
      isHttps,
    };

    /*
     * Audit a few interior pages alongside the entry page. Scoring only the
     * homepage was the tool's biggest accuracy gap — businesses commonly have a
     * polished front page and untouched service pages, so the homepage alone
     * flatters the site. Prefer the sitemap for discovery, fall back to the
     * page's own links. Core Web Vitals are fetched once and shared, since
     * re-running Lighthouse per page would blow the time budget.
     */
    const entryKey = finalUrl.split("#")[0].replace(/\/$/, "");
    const discovered = [
      ...(await urlsFromSitemap(origin, controller.signal)),
      ...urlsFromLinks(html, origin),
    ]
      .map((u) => u.split("#")[0].replace(/\/$/, ""))
      .filter((u) => u !== entryKey && u !== origin);

    const extraUrls = [...new Set(discovered)].slice(0, MAX_PAGES - 1);
    const extraHtml = await Promise.all(
      extraUrls.map((u) => fetchHtml(u, controller.signal))
    );

    const auditUrls = [finalUrl];
    const audits = [
      runAudit({ url: url.toString(), finalUrl, html, vitals, ...shared }),
    ];
    extraHtml.forEach((pageHtml, i) => {
      if (!pageHtml) return;
      auditUrls.push(extraUrls[i]);
      // Vitals are page-specific; only the entry page has measured values.
      audits.push(
        runAudit({ url: extraUrls[i], finalUrl: extraUrls[i], html: pageHtml, vitals: null, ...shared })
      );
    });

    // combineAudits already strips per-check detail — scores and counts only.
    return NextResponse.json(combineAudits(audits, auditUrls), { status: 200 });
  } catch (err) {
    console.error("[SiteBrew] Audit error:", err);
    return NextResponse.json({ error: "Something went wrong running the audit." }, { status: 500 });
  }
}
