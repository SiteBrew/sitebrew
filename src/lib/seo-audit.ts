/**
 * SiteBrew Website Health Engine
 *
 * Runs real, verifiable checks against a live URL and returns category scores.
 *
 * SCOPE — read this before changing scoring.
 * This measures technical health, on-page structure, and Core Web Vitals for a
 * SINGLE page. It deliberately does NOT measure backlinks, domain authority,
 * Google Business Profile signals, keyword relevance, or current SERP position.
 * Those are the largest drivers of local ranking and none of them are knowable
 * from one page fetch. The UI says so plainly — overclaiming here would be
 * trivially disprovable by any prospect running Ahrefs or Semrush.
 *
 * WHAT IS WITHHELD
 * The public payload carries category scores and issue counts, never the
 * specific failing checks or how to fix them. The diagnosis is free and real;
 * the remedy is the conversation.
 *
 * SEVERITY WEIGHTING
 * Weights reflect actual ranking impact, not how easy a thing is to detect.
 * A missing og:image affects social click-through and nothing else, so it is
 * 'minor'. A noindex tag removes the page from Google entirely, so it is
 * 'critical'. Getting this backwards produces scores that look authoritative
 * and are wrong.
 */

export type Severity = 'critical' | 'warning' | 'minor';

export interface Check {
  id: string;
  label: string;
  passed: boolean;
  severity: Severity;
  /** Internal only — for the emailed report, never the public response. */
  detail?: string;
  /** Excluded from scoring entirely — neither pass nor fail. */
  unassessable?: boolean;
}

export interface CategoryResult {
  key: string;
  label: string;
  blurb: string;
  score: number;
  grade: string;
  passed: number;
  total: number;
  issues: number;
  criticalIssues: number;
  assessed: boolean;
}

/** Field (real-user) or lab Core Web Vitals, from PageSpeed Insights. */
export interface CoreWebVitals {
  /** 'field' = real Chrome user data (what Google actually ranks on). */
  source: 'field' | 'lab';
  lcp?: number; // seconds
  cls?: number; // unitless
  inp?: number; // milliseconds
  performanceScore?: number; // 0-100, lab only
}

export interface AuditResult {
  url: string;
  finalUrl: string;
  fetchedAt: string;
  overallScore: number;
  overallGrade: string;
  totalIssues: number;
  criticalIssues: number;
  categories: CategoryResult[];
  javascriptRendered: boolean;
  /** Present only when PageSpeed Insights returned data. */
  vitals?: CoreWebVitals;
}

export interface DetailedAuditResult extends AuditResult {
  checks: Check[];
}

const SEVERITY_WEIGHT: Record<Severity, number> = {
  critical: 5,
  warning: 2,
  minor: 1,
};

export function toGrade(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

/* ── HTML helpers ─────────────────────────────────────────────────────────── */

const stripTags = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const head = (html: string) => {
  const m = html.match(/<head[\s\S]*?<\/head>/i);
  return m ? m[0] : html.slice(0, 40000);
};

const metaContent = (html: string, attr: 'name' | 'property', value: string) => {
  const re = new RegExp(`<meta[^>]+${attr}=["']${value}["'][^>]*content=["']([^"']*)["']`, 'i');
  const alt = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*${attr}=["']${value}["']`, 'i');
  return (html.match(re)?.[1] ?? html.match(alt)?.[1] ?? '').trim();
};

const tagText = (html: string, tag: string) => {
  const m = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return m ? stripTags(m[1]) : '';
};

const countTags = (html: string, tag: string) =>
  (html.match(new RegExp(`<${tag}[\\s>]`, 'gi')) || []).length;

/* ── Categories ───────────────────────────────────────────────────────────── */

/*
 * Category weights drive the overall score. Scoring the raw check list instead
 * lets whichever category happens to contain the most checks dominate: with six
 * social/schema checks and three performance checks, a site failing every Core
 * Web Vital still averaged out to a B. Weighting by category keeps each area's
 * influence proportional to how much it actually affects ranking.
 */
const CATEGORIES = [
  {
    key: 'technical',
    weight: 25,
    label: 'Technical Foundation',
    blurb: 'Whether search engines can reach, crawl, and index the page.',
  },
  {
    key: 'performance',
    weight: 20,
    label: 'Speed & Core Web Vitals',
    blurb: 'Google’s confirmed page-experience ranking signals.',
  },
  {
    key: 'onpage',
    weight: 20,
    label: 'On-Page SEO',
    blurb: 'Titles, descriptions, and heading structure.',
  },
  {
    key: 'content',
    weight: 15,
    label: 'Content & Accessibility',
    blurb: 'Content depth, image alt text, and internal linking.',
  },
  {
    key: 'social',
    weight: 8,
    label: 'Social & Sharing',
    blurb: 'How links look when shared. Affects click-through, not rankings.',
  },
  {
    key: 'schema',
    weight: 12,
    label: 'Structured Data',
    blurb: 'Markup powering rich results and local listings.',
  },
] as const;

/* ── Audit ────────────────────────────────────────────────────────────────── */

export interface AuditInput {
  url: string;
  finalUrl: string;
  html: string;
  robotsTxtOk: boolean;
  sitemapOk: boolean;
  isHttps: boolean;
  vitals?: CoreWebVitals | null;
}

export function runAudit(input: AuditInput): DetailedAuditResult {
  const { html, finalUrl, isHttps, robotsTxtOk, sitemapOk, vitals } = input;
  const h = head(html);
  const body = stripTags(html);
  const checks: Array<Check & { category: string }> = [];

  const wordCountRaw = body.split(/\s+/).filter(Boolean).length;
  const hasMountNode = /<div[^>]+id=["'](root|__next|app)["']/i.test(html);
  const hasScripts = /<script[^>]+src=/i.test(html);
  const javascriptRendered = wordCountRaw < 60 && hasMountNode && hasScripts;

  const add = (
    category: string,
    id: string,
    label: string,
    passed: boolean,
    severity: Severity,
    detail?: string,
    domDependent = false
  ) =>
    checks.push({
      category,
      id,
      label,
      passed,
      severity,
      detail,
      unassessable: domDependent && javascriptRendered,
    });

  /* — Technical — */
  add('technical', 'https', 'Served over HTTPS', isHttps, 'critical',
    isHttps ? 'Secure.' : 'Not served over HTTPS. A confirmed ranking factor, and Chrome warns visitors.');

  const noindex = /noindex/i.test(metaContent(h, 'name', 'robots'));
  add('technical', 'indexable', 'Page is indexable', !noindex, 'critical',
    noindex ? 'NOINDEX is set — this page cannot appear in Google at all.' : 'Indexable.');

  const viewport = metaContent(h, 'name', 'viewport');
  add('technical', 'viewport', 'Mobile viewport configured', Boolean(viewport), 'critical',
    viewport ? 'Set.' : 'No viewport meta tag. Google indexes mobile-first.');

  const canonical = h.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']*)["']/i)?.[1];
  add('technical', 'canonical', 'Canonical URL set', Boolean(canonical), 'warning',
    canonical ? `Canonical: ${canonical}` : 'No canonical tag — risks duplicate-content dilution.');

  // Absent robots.txt is neutral for most small sites; a sitemap mainly speeds discovery.
  add('technical', 'sitemap', 'XML sitemap present', sitemapOk, 'minor',
    sitemapOk ? 'Found.' : 'No sitemap.xml — new pages take longer to be discovered.');
  add('technical', 'robots', 'robots.txt present', robotsTxtOk, 'minor',
    robotsTxtOk ? 'Found.' : 'No robots.txt. Not harmful, but it is where the sitemap is advertised.');

  /* — Performance (Core Web Vitals) — */
  if (vitals) {
    const { lcp, cls, inp, source } = vitals;
    const note = source === 'field' ? 'real-user data' : 'lab simulation';

    if (typeof lcp === 'number') {
      add('performance', 'lcp', 'Largest Contentful Paint under 2.5s', lcp <= 2.5, 'warning',
        `LCP is ${lcp.toFixed(2)}s (${note}). Google considers 2.5s or less good.`);
    }
    if (typeof cls === 'number') {
      add('performance', 'cls', 'Cumulative Layout Shift under 0.1', cls <= 0.1, 'warning',
        `CLS is ${cls.toFixed(3)} (${note}). Google considers 0.1 or less good.`);
    }
    if (typeof inp === 'number') {
      add('performance', 'inp', 'Interaction to Next Paint under 200ms', inp <= 200, 'warning',
        `INP is ${Math.round(inp)}ms (${note}). Google considers 200ms or less good.`);
    }
    if (typeof vitals.performanceScore === 'number') {
      add('performance', 'perf-score', 'Lighthouse performance score 90+',
        vitals.performanceScore >= 90, 'warning',
        `Lighthouse performance score: ${vitals.performanceScore}/100.`);
    }
  }

  /* — On-page — */
  const title = tagText(h, 'title');
  add('onpage', 'title-exists', 'Title tag present', Boolean(title), 'critical',
    title ? `"${title}"` : 'No title tag.');
  add('onpage', 'title-length', 'Title length within 30–60 characters',
    title.length >= 30 && title.length <= 60, 'warning',
    `Title is ${title.length} characters. Google truncates around 60.`);

  const desc = metaContent(h, 'name', 'description');
  // Not a direct ranking factor — it drives click-through from the results page.
  add('onpage', 'desc-exists', 'Meta description present', Boolean(desc), 'warning',
    desc ? `"${desc}"` : 'No meta description — Google will invent one from page text.');
  add('onpage', 'desc-length', 'Meta description within 120–160 characters',
    desc.length >= 120 && desc.length <= 160, 'minor',
    `Description is ${desc.length} characters.`);

  const h1Count = countTags(html, 'h1');
  add('onpage', 'h1-single', 'Exactly one H1 heading', h1Count === 1, 'warning',
    `Found ${h1Count} H1 tag(s).`, true);
  const h2Count = countTags(html, 'h2');
  add('onpage', 'heading-structure', 'Supporting H2 headings present', h2Count >= 2, 'minor',
    `Found ${h2Count} H2 tag(s).`, true);

  /* — Content — */
  const words = wordCountRaw;
  add('content', 'word-count', 'Substantial page content (300+ words)', words >= 300, 'warning',
    `Approximately ${words} words of visible text.`, true);

  const imgs = html.match(/<img[^>]*>/gi) || [];
  const imgsWithAlt = imgs.filter((t) => /alt=["'][^"']+["']/i.test(t)).length;
  const altRatio = imgs.length ? imgsWithAlt / imgs.length : 1;
  add('content', 'img-alt', 'Images have descriptive alt text', altRatio >= 0.9, 'warning',
    imgs.length ? `${imgsWithAlt} of ${imgs.length} images have alt text.` : 'No images found.', true);

  const internalLinks = (html.match(/<a[^>]+href=["'](\/|https?:\/\/[^"']*)["']/gi) || []).length;
  add('content', 'internal-links', 'Internal linking present', internalLinks >= 5, 'minor',
    `Found roughly ${internalLinks} links.`, true);

  add('content', 'lang', 'Page language declared',
    /<html[^>]+lang=["'][a-z-]+["']/i.test(html), 'minor',
    'The <html> tag should declare a lang attribute.');

  /* — Social (click-through only; no direct ranking impact) — */
  const ogTitle = metaContent(h, 'property', 'og:title');
  const ogDesc = metaContent(h, 'property', 'og:description');
  const ogImage = metaContent(h, 'property', 'og:image');
  const twCard = metaContent(h, 'name', 'twitter:card');

  add('social', 'og-title', 'Open Graph title set', Boolean(ogTitle), 'minor',
    ogTitle || 'Missing — shared links show a bare URL.');
  add('social', 'og-desc', 'Open Graph description set', Boolean(ogDesc), 'minor', ogDesc || 'Missing.');
  add('social', 'og-image', 'Open Graph image set', Boolean(ogImage), 'warning',
    ogImage || 'Missing — links shared on LinkedIn or Facebook show no preview image.');
  add('social', 'twitter-card', 'Twitter Card configured', Boolean(twCard), 'minor', twCard || 'Missing.');

  /* — Structured data — */
  const ldBlocks = html.match(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi) || [];
  add('schema', 'schema-present', 'Structured data (JSON-LD) present', ldBlocks.length > 0, 'warning',
    ldBlocks.length ? `${ldBlocks.length} JSON-LD block(s) found.` : 'No structured data.');

  let validSchema = false;
  const types: string[] = [];
  for (const b of ldBlocks) {
    try {
      const parsed = JSON.parse(b.replace(/<[^>]+>/g, ''));
      validSchema = true;
      const nodes = parsed['@graph'] ?? (Array.isArray(parsed) ? parsed : [parsed]);
      types.push(...nodes.map((n: { '@type'?: string }) => n['@type']).filter(Boolean));
    } catch {
      /* leave validSchema false */
    }
  }
  add('schema', 'schema-valid', 'Structured data parses correctly',
    ldBlocks.length > 0 && validSchema, 'warning',
    validSchema ? `Types: ${types.join(', ')}` : 'JSON-LD present but failed to parse.');

  const hasLocal = types.some((t) => /LocalBusiness|Organization/i.test(t));
  add('schema', 'schema-local', 'Business or LocalBusiness markup present', hasLocal, 'warning',
    hasLocal ? `Found: ${types.join(', ')}` : 'No Organization or LocalBusiness markup.');

  /* — Score — */
  const categories: CategoryResult[] = CATEGORIES.map((cat) => {
    const own = checks.filter((c) => c.category === cat.key && !c.unassessable);
    const earned = own.reduce((s, c) => s + (c.passed ? SEVERITY_WEIGHT[c.severity] : 0), 0);
    const possible = own.reduce((s, c) => s + SEVERITY_WEIGHT[c.severity], 0);
    const assessed = own.length > 0;
    const score = assessed && possible ? Math.round((earned / possible) * 100) : 0;
    const failed = own.filter((c) => !c.passed);
    return {
      key: cat.key,
      label: cat.label,
      blurb: cat.blurb,
      score,
      grade: assessed ? toGrade(score) : 'N/A',
      assessed,
      passed: own.length - failed.length,
      total: own.length,
      issues: failed.length,
      criticalIssues: failed.filter((c) => c.severity === 'critical').length,
    };
  });

  const scorable = checks.filter((c) => !c.unassessable);
  const allFailed = scorable.filter((c) => !c.passed);

  // Weighted mean across assessed categories. Unassessed categories drop out and
  // their weight redistributes, so a missing PageSpeed result doesn't score as 0.
  const assessedCats = categories.filter((c) => c.assessed);
  const catWeight = (k: string) => CATEGORIES.find((c) => c.key === k)?.weight ?? 0;
  const totalWeight = assessedCats.reduce((sum, c) => sum + catWeight(c.key), 0);
  const rawScore = totalWeight
    ? Math.round(assessedCats.reduce((sum, c) => sum + c.score * catWeight(c.key), 0) / totalWeight)
    : 0;
  const criticalFails = allFailed.filter((c) => c.severity === 'critical');

  /*
   * Critical failures CAP the overall score rather than merely subtracting from
   * it. Weighted averaging alone dilutes them: a page carrying a noindex tag —
   * invisible to Google, full stop — still averaged out to 88/100 because every
   * other check passed. Reporting that as a B would be indefensible the moment
   * a prospect checked. A fundamental break has to dominate the headline number.
   */
  let cap = 100;
  if (criticalFails.some((c) => c.id === 'indexable')) cap = 35; // cannot rank at all
  else if (criticalFails.length >= 2) cap = 45;
  else if (criticalFails.length === 1) cap = 65;
  const finalScore = Math.min(rawScore, cap);

  return {
    url: input.url,
    finalUrl,
    fetchedAt: new Date().toISOString(),
    overallScore: finalScore,
    overallGrade: toGrade(finalScore),
    totalIssues: allFailed.length,
    criticalIssues: allFailed.filter((c) => c.severity === 'critical').length,
    categories,
    javascriptRendered,
    vitals: vitals ?? undefined,
    checks: checks.map(({ category: _category, ...c }) => c),
  };
}

/** Strip the specifics before sending to the browser. */
export function toPublicResult(r: DetailedAuditResult): AuditResult {
  const { checks: _checks, ...pub } = r;
  return pub;
}
