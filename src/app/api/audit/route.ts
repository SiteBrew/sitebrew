import { NextRequest, NextResponse } from "next/server";
import { runAudit, toPublicResult } from "@/lib/seo-audit";

export const runtime = "nodejs";
export const maxDuration = 20;

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
    const timeout = setTimeout(() => controller.abort(), 12000);

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

    const [robotsTxtOk, sitemapOk] = await Promise.all([
      headOk(`${origin}/robots.txt`, controller.signal),
      headOk(`${origin}/sitemap.xml`, controller.signal),
    ]);
    clearTimeout(timeout);

    const detailed = runAudit({
      url: url.toString(),
      finalUrl,
      html,
      robotsTxtOk,
      sitemapOk,
      isHttps: new URL(finalUrl).protocol === "https:",
    });

    // Strip the specific findings. Scores and issue counts are real and shown;
    // which checks failed, and how to fix them, is the conversation.
    return NextResponse.json(toPublicResult(detailed), { status: 200 });
  } catch (err) {
    console.error("[SiteBrew] Audit error:", err);
    return NextResponse.json({ error: "Something went wrong running the audit." }, { status: 500 });
  }
}
