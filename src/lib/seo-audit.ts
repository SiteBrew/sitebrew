/**
 * SiteBrew SEO Audit Engine
 *
 * Runs real, verifiable checks against a live URL and returns category scores.
 *
 * DESIGN NOTE — what this deliberately does NOT return:
 * The public payload includes category scores and issue counts, but never the
 * specific failing checks or how to fix them. The diagnosis is free and real;
 * the remedy is the conversation. Every score here is derived from an actual
 * check against the fetched HTML — nothing is simulated or inflated.
 */

export type Severity = 'critical' | 'warning' | 'minor';

export interface Check {
  id: string;
  label: string;
  passed: boolean;
  severity: Severity;
  /** Internal only — surfaced in the emailed report, never in the public response. */
  detail?: string;
  /**
   * Set when the check can't be judged from raw HTML (JS-rendered page).
   * Unassessable checks are excluded from scoring entirely — neither pass nor fail.
   */
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
  /** False when every check in this category was unassessable (JS-rendered page). */
  assessed: boolean;
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
  /**
   * True when the page ships an near-empty HTML shell and renders its content
   * with JavaScript (React/Vue SPAs). Googlebot executes JS and will see that
   * content, but this audit reads raw HTML — so DOM-dependent checks are marked
   * unassessable and excluded from scoring rather than failed. Scoring them
   * would hand a prospect an obviously wrong result.
   */
  javascriptRendered: boolean;
}

/** Full result including specifics — for the internal email, not the browser. */
export interface DetailedAuditResult extends AuditResult {
  checks: Check[];
}

const SEVERITY_WEIGHT: Record<Severity, number> = {
  critical: 3,
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

/* ── HTML helpers (regex-based; no DOM on the server, no dependencies) ────── */

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
  const re = new RegExp(
    `<meta[^>]+${attr}=["']${value}["'][^>]*content=["']([^"']*)["']`,
    'i'
  );
  const alt = new RegExp(
    `<meta[^>]+content=["']([^"']*)["'][^>]*${attr}=["']${value}["']`,
    'i'
  );
  return (html.match(re)?.[1] ?? html.match(alt)?.[1] ?? '').trim();
};

const tagText = (html: string, tag: string) => {
  const m = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return m ? stripTags(m[1]) : '';
};

const countTags = (html: string, tag: string) =>
  (html.match(new RegExp(`<${tag}[\\s>]`, 'gi')) || []).length;

/* ── Category definitions ─────────────────────────────────────────────────── */

const CATEGORIES = [
  {
    key: 'technical',
    label: 'Technical Foundation',
    blurb: 'Whether search engines can reach, crawl, and index the site correctly.',
  },
  {
    key: 'onpage',
    label: 'On-Page SEO',
    blurb: 'Titles, descriptions, and headings — what Google reads first.',
  },
  {
    key: 'content',
    label: 'Content & Accessibility',
    blurb: 'Depth of content, image alt text, and internal linking.',
  },
  {
    key: 'social',
    label: 'Social & Sharing',
    blurb: 'How the site looks when shared on LinkedIn, Facebook, or in messages.',
  },
  {
    key: 'schema',
    label: 'Structured Data',
    blurb: 'Machine-readable markup that powers rich results and local listings.',
  },
] as const;

/* ── The audit ────────────────────────────────────────────────────────────── */

export interface AuditInput {
  url: string;
  finalUrl: string;
  html: string;
  robotsTxtOk: boolean;
  sitemapOk: boolean;
  isHttps: boolean;
}

export function runAudit(input: AuditInput): DetailedAuditResult {
  const { html, finalUrl, isHttps, robotsTxtOk, sitemapOk } = input;
  const h = head(html);
  const body = stripTags(html);
  const checks: Array<Check & { category: string }> = [];

  // A near-empty <body> plus a mount node plus scripts means the content is
  // rendered client-side. Googlebot runs JS and sees it; we don't.
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
    /** Marks the check unassessable when the page is JS-rendered. */
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
    isHttps ? 'Secure.' : 'Site is not served over HTTPS. Chrome flags this to visitors.');

  add('technical', 'robots', 'robots.txt present', robotsTxtOk, 'warning',
    robotsTxtOk ? 'Found.' : 'No robots.txt — crawlers get no guidance and no sitemap pointer.');

  add('technical', 'sitemap', 'XML sitemap present', sitemapOk, 'warning',
    sitemapOk ? 'Found.' : 'No sitemap.xml — new pages take longer to be discovered.');

  const canonical = h.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']*)["']/i)?.[1];
  add('technical', 'canonical', 'Canonical URL set', Boolean(canonical), 'warning',
    canonical ? `Canonical: ${canonical}` : 'No canonical tag — risks duplicate-content dilution.');

  const viewport = metaContent(h, 'name', 'viewport');
  add('technical', 'viewport', 'Mobile viewport configured', Boolean(viewport), 'critical',
    viewport ? 'Set.' : 'No viewport meta tag — the site will not render correctly on phones.');

  const noindex = /noindex/i.test(metaContent(h, 'name', 'robots'));
  add('technical', 'indexable', 'Page is indexable', !noindex, 'critical',
    noindex ? 'Page is set to NOINDEX — it cannot appear in Google at all.' : 'Indexable.');

  /* — On-page — */
  const title = tagText(h, 'title');
  add('onpage', 'title-exists', 'Title tag present', Boolean(title), 'critical',
    title ? `"${title}"` : 'No title tag.');
  add('onpage', 'title-length', 'Title length within 30–60 characters',
    title.length >= 30 && title.length <= 60, 'warning',
    `Title is ${title.length} characters. Google truncates around 60.`);

  const desc = metaContent(h, 'name', 'description');
  add('onpage', 'desc-exists', 'Meta description present', Boolean(desc), 'critical',
    desc ? `"${desc}"` : 'No meta description — Google will invent one from page text.');
  add('onpage', 'desc-length', 'Meta description within 120–160 characters',
    desc.length >= 120 && desc.length <= 160, 'warning',
    `Description is ${desc.length} characters.`);

  const h1Count = countTags(html, 'h1');
  add('onpage', 'h1-single', 'Exactly one H1 heading', h1Count === 1, 'warning',
    `Found ${h1Count} H1 tag(s). Exactly one is correct.`, true);

  const h2Count = countTags(html, 'h2');
  add('onpage', 'heading-structure', 'Supporting H2 headings present', h2Count >= 2, 'minor',
    `Found ${h2Count} H2 tag(s).`, true);

  /* — Content — */
  const words = body.split(/\s+/).filter(Boolean).length;
  add('content', 'word-count', 'Substantial page content (300+ words)', words >= 300, 'warning',
    `Approximately ${words} words of visible text.`, true);

  const imgs = html.match(/<img[^>]*>/gi) || [];
  const imgsWithAlt = imgs.filter((t) => /alt=["'][^"']+["']/i.test(t)).length;
  const altRatio = imgs.length ? imgsWithAlt / imgs.length : 1;
  add('content', 'img-alt', 'Images have descriptive alt text', altRatio >= 0.9, 'warning',
    imgs.length
      ? `${imgsWithAlt} of ${imgs.length} images have alt text.`
      : 'No images found on the page.', true);

  const internalLinks = (html.match(/<a[^>]+href=["'](\/|https?:\/\/[^"']*)["']/gi) || []).length;
  add('content', 'internal-links', 'Internal linking present', internalLinks >= 5, 'minor',
    `Found roughly ${internalLinks} links.`, true);

  add('content', 'lang', 'Page language declared',
    /<html[^>]+lang=["'][a-z-]+["']/i.test(html), 'minor',
    'The <html> tag should declare a lang attribute for accessibility and search.');

  /* — Social — */
  const ogTitle = metaContent(h, 'property', 'og:title');
  const ogDesc = metaContent(h, 'property', 'og:description');
  const ogImage = metaContent(h, 'property', 'og:image');
  const twCard = metaContent(h, 'name', 'twitter:card');

  add('social', 'og-title', 'Open Graph title set', Boolean(ogTitle), 'warning',
    ogTitle || 'Missing — shared links show a bare URL instead of a headline.');
  add('social', 'og-desc', 'Open Graph description set', Boolean(ogDesc), 'warning',
    ogDesc || 'Missing.');
  add('social', 'og-image', 'Open Graph image set', Boolean(ogImage), 'critical',
    ogImage || 'Missing — links shared on LinkedIn or Facebook show no preview image.');
  add('social', 'twitter-card', 'Twitter Card configured', Boolean(twCard), 'minor',
    twCard || 'Missing.');

  /* — Structured data — */
  const ldBlocks = html.match(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi) || [];
  add('schema', 'schema-present', 'Structured data (JSON-LD) present', ldBlocks.length > 0, 'critical',
    ldBlocks.length ? `${ldBlocks.length} JSON-LD block(s) found.` : 'No structured data at all.');

  let validSchema = false;
  let types: string[] = [];
  for (const b of ldBlocks) {
    const json = b.replace(/<[^>]+>/g, '');
    try {
      const parsed = JSON.parse(json);
      validSchema = true;
      const nodes = parsed['@graph'] ?? (Array.isArray(parsed) ? parsed : [parsed]);
      types.push(...nodes.map((n: { '@type'?: string }) => n['@type']).filter(Boolean));
    } catch {
      /* invalid block — validSchema stays false for this one */
    }
  }
  add('schema', 'schema-valid', 'Structured data parses correctly',
    ldBlocks.length > 0 && validSchema, 'warning',
    validSchema ? `Types: ${types.join(', ')}` : 'JSON-LD present but failed to parse.');

  const hasLocal = types.some((t) => /LocalBusiness|Organization/i.test(t));
  add('schema', 'schema-local', 'Business or LocalBusiness markup present', hasLocal, 'warning',
    hasLocal ? `Found: ${types.join(', ')}` : 'No Organization or LocalBusiness markup — hurts local search.');

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
  const earned = scorable.reduce((s, c) => s + (c.passed ? SEVERITY_WEIGHT[c.severity] : 0), 0);
  const possible = scorable.reduce((s, c) => s + SEVERITY_WEIGHT[c.severity], 0);
  const overallScore = Math.round((earned / possible) * 100);

  return {
    url: input.url,
    finalUrl,
    fetchedAt: new Date().toISOString(),
    overallScore,
    overallGrade: toGrade(overallScore),
    totalIssues: allFailed.length,
    criticalIssues: allFailed.filter((c) => c.severity === 'critical').length,
    categories,
    javascriptRendered,
    checks: checks.map(({ category: _category, ...c }) => c),
  };
}

/** Strip the specifics before sending to the browser. */
export function toPublicResult(r: DetailedAuditResult): AuditResult {
  const { checks: _checks, ...pub } = r;
  return pub;
}
