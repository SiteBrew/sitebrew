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

/*
 * Faults that make a page unfit for search regardless of everything else.
 * Only these trigger the score cap. Severity is left free to express weight:
 * a brand-only title is nearly as damaging as no title, so it earns weight 5,
 * but it isn't fatal and shouldn't floor the whole site at 35.
 */
const FATAL_CHECKS = new Set(['https', 'indexable', 'viewport', 'title-exists']);

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

/**
 * Body text with site chrome removed.
 *
 * Counting raw stripped HTML credits navigation, footers, cookie banners and
 * repeated menus as "content", which flatters thin pages — a homepage with two
 * paragraphs and a 40-link mega-menu looked substantial. Strip the chrome first,
 * and prefer <main>/<article> when the page marks it up.
 */
const contentText = (html: string) => {
  const scoped = html.match(/<(?:main|article)[^>]*>[\s\S]*?<\/(?:main|article)>/i);
  const source = scoped ? scoped[0] : html;
  return stripTags(
    source
      .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
      .replace(/<header[\s\S]*?<\/header>/gi, ' ')
      .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
      .replace(/<aside[\s\S]*?<\/aside>/gi, ' ')
      .replace(/<form[\s\S]*?<\/form>/gi, ' ')
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
  );
};

/**
 * One entry per real image on the page.
 *
 * Squarespace, Wix and modern WordPress serve responsive images as
 * <picture><source ...><source ...><img></picture>. Counting every <source> as
 * its own image was badly wrong: six photos with empty alt attributes came back
 * as "12 of 18 images have alt text", and the modern-format check flipped to a
 * PASS because the <source> variants were WebP even though every real <img>
 * pointed at a .jpg. A <picture> block is ONE image — alt and dimensions come
 * from its <img>, and the format is modern if any of its sources is.
 */
interface ImgInfo { hasAlt: boolean; modern: boolean; sized: boolean }

const urlAttrs = (tag: string) =>
  (tag.match(/(?:src|data-src|data-lazy-src|data-original|srcset|data-srcset)=["']([^"']+)["']/gi) || []).join(' ');

const isModern = (frag: string) =>
  /\.(webp|avif)\b/i.test(urlAttrs(frag)) || /type=["']image\/(webp|avif)["']/i.test(frag);

const describeImg = (imgTag: string, pictureBlock?: string): ImgInfo => ({
  hasAlt: /alt=["'][^"']+["']/i.test(imgTag),
  // A WebP <source> genuinely does mean the browser gets WebP, so check the
  // whole <picture> — but only once, for the single image it represents.
  modern: isModern(imgTag) || (pictureBlock ? isModern(pictureBlock) : false),
  sized: /\bwidth=/i.test(imgTag) && /\bheight=/i.test(imgTag),
});

const collectImages = (html: string): ImgInfo[] => {
  const out: ImgInfo[] = [];

  const pictures = html.match(/<picture[\s\S]*?<\/picture>/gi) || [];
  for (const block of pictures) {
    const img = block.match(/<img[^>]*>/i)?.[0] ?? '';
    out.push(describeImg(img, block));
  }

  // Standalone <img> tags — everything not already counted inside a <picture>.
  const withoutPictures = html.replace(/<picture[\s\S]*?<\/picture>/gi, ' ');
  for (const img of withoutPictures.match(/<img[^>]*>/gi) || []) {
    out.push(describeImg(img));
  }

  return out;
};

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
 * Technical basics (HTTPS, viewport, canonical, sitemap) are set automatically
 * by Squarespace, Wix, Shopify and every modern WordPress theme. Weighting them
 * heavily scores the hosting platform, not the site: a tattoo studio whose title
 * tag was the four letters "HCTC" and whose meta description was empty still
 * banked a full 25 points there. They're now 14. Structured data went the same
 * way for the same reason — Squarespace injects LocalBusiness markup from the
 * business details you type into settings, so 16% was paying for the platform
 * a second time. It is now 8, with the weight moved to on-page and content.
 *
 * Category weights drive the overall score. Scoring the raw check list instead
 * lets whichever category happens to contain the most checks dominate: with six
 * social/schema checks and three performance checks, a site failing every Core
 * Web Vital still averaged out to a B. Weighting by category keeps each area's
 * influence proportional to how much it actually affects ranking.
 */
const CATEGORIES = [
  {
    key: 'technical',
    weight: 14,
    label: 'Technical Foundation',
    blurb: 'Whether search engines can reach, crawl, and index the page.',
  },
  {
    key: 'performance',
    weight: 18,
    label: 'Speed & Core Web Vitals',
    blurb: 'Google’s confirmed page-experience ranking signals.',
  },
  {
    key: 'onpage',
    weight: 30,
    label: 'On-Page SEO',
    blurb: 'Titles, descriptions, and heading structure.',
  },
  {
    key: 'content',
    weight: 26,
    label: 'Content & Accessibility',
    blurb: 'Content depth, image alt text, and internal linking.',
  },
  {
    key: 'social',
    weight: 4,
    label: 'Social & Sharing',
    blurb: 'How links look when shared. Affects click-through, not rankings.',
  },
  {
    key: 'schema',
    weight: 8,
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
  /** robots.txt contains a Sitemap: directive. */
  sitemapInRobots?: boolean;
  vitals?: CoreWebVitals | null;
}

export function runAudit(input: AuditInput): DetailedAuditResult {
  const { html, finalUrl, isHttps, robotsTxtOk, sitemapOk, vitals } = input;
  const sitemapInRobots = input.sitemapInRobots ?? false;
  const pageBytes = Buffer.byteLength(html, 'utf8');
  const h = head(html);
  const body = contentText(html);
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
    isHttps ? 'Secure.' : 'Not served over HTTPS. Confirmed ranking factor; Chrome warns visitors.');

  const noindex = /noindex/i.test(metaContent(h, 'name', 'robots'));
  add('technical', 'indexable', 'Page is indexable', !noindex, 'critical',
    noindex ? 'NOINDEX is set — this page cannot appear in Google at all.' : 'Indexable.');

  const viewport = metaContent(h, 'name', 'viewport');
  add('technical', 'viewport', 'Mobile viewport configured', Boolean(viewport), 'critical',
    viewport ? 'Set.' : 'No viewport meta tag. Google indexes mobile-first.');

  const canonicals = h.match(/<link[^>]+rel=["']canonical["']/gi) || [];
  add('technical', 'canonical', 'Exactly one canonical URL', canonicals.length === 1, 'warning',
    canonicals.length === 1 ? 'Set.' :
    canonicals.length === 0 ? 'No canonical tag — risks duplicate-content dilution.'
      : `${canonicals.length} canonical tags — conflicting signals; Google may ignore all of them.`);

  add('technical', 'sitemap', 'XML sitemap present', sitemapOk, 'warning',
    sitemapOk ? 'Found.' : 'No sitemap.xml — new pages take longer to be discovered.');
  add('technical', 'robots', 'robots.txt present', robotsTxtOk, 'minor',
    robotsTxtOk ? 'Found.' : 'No robots.txt.');
  // Most sites that have both never connect them, so crawlers never find the sitemap.
  add('technical', 'sitemap-in-robots', 'Sitemap advertised in robots.txt', sitemapInRobots, 'minor',
    sitemapInRobots ? 'Declared.' : 'robots.txt does not reference the sitemap.');

  add('technical', 'favicon', 'Favicon declared',
    /<link[^>]+rel=["'][^"']*icon[^"']*["']/i.test(h), 'minor',
    'A declared favicon improves brand recognition in results and tabs.');

  const pageKb = Math.round(pageBytes / 1024);
  add('technical', 'page-weight', 'Page HTML under 500KB', pageKb <= 500, 'warning',
    `HTML payload is ${pageKb}KB. Heavy documents slow first render on mobile.`);

  /* — Performance (Core Web Vitals) — */
  if (vitals) {
    const { lcp, cls, inp, source } = vitals;
    const note = source === 'field' ? 'real-user data' : 'lab simulation';

    if (typeof lcp === 'number') {
      add('performance', 'lcp', 'Largest Contentful Paint under 2.5s', lcp <= 2.5, 'warning',
        `LCP is ${lcp.toFixed(2)}s (${note}). Google's "good" threshold is 2.5s.`);
      add('performance', 'lcp-excellent', 'LCP under 1.8s (excellent)', lcp <= 1.8, 'minor',
        `LCP is ${lcp.toFixed(2)}s. Under 1.8s is genuinely fast.`);
    }
    if (typeof cls === 'number') {
      add('performance', 'cls', 'Cumulative Layout Shift under 0.1', cls <= 0.1, 'warning',
        `CLS is ${cls.toFixed(3)} (${note}). Google's "good" threshold is 0.1.`);
    }
    if (typeof inp === 'number') {
      add('performance', 'inp', 'Interaction to Next Paint under 200ms', inp <= 200, 'warning',
        `INP is ${Math.round(inp)}ms (${note}). Google's "good" threshold is 200ms.`);
    }
    if (typeof vitals.performanceScore === 'number') {
      add('performance', 'perf-score', 'Lighthouse performance score 90+',
        vitals.performanceScore >= 90, 'warning',
        `Lighthouse performance: ${vitals.performanceScore}/100.`);
    }
  }

  /* — On-page — */
  const title = tagText(h, 'title');
  const titleLower = title.toLowerCase();
  add('onpage', 'title-exists', 'Title tag present', Boolean(title), 'critical',
    title ? `"${title}"` : 'No title tag.');
  add('onpage', 'title-length', 'Title length within 30–60 characters',
    title.length >= 30 && title.length <= 60, 'critical',
    `Title is ${title.length} characters. Google truncates around 60.`);
  // Generic titles are extremely common and waste the single strongest on-page signal.
  const siteName = metaContent(h, 'property', 'og:site_name');
  const domainRoot = (() => {
    try { return new URL(finalUrl).hostname.replace(/^www\./, '').split('.')[0]; } catch { return ''; }
  })();
  const norm = (t: string) => t.toLowerCase().replace(/[^a-z0-9]/g, '');
  const titleWords = title.trim().split(/\s+/).filter(Boolean).length;
  const genericWord = /^(home|welcome|untitled|index|home page|my site|new page)\b/i.test(title.trim());
  // Brand-only titles ("HCTC", "Miller Plumbing") waste the strongest on-page
  // signal there is: nobody searches the brand they haven't heard of yet.
  const brandOnly =
    Boolean(title) &&
    (norm(title) === norm(siteName) || norm(title) === domainRoot || titleWords < 3);
  add('onpage', 'title-descriptive', 'Title names the service, not just the brand',
    Boolean(title) && !genericWord && !brandOnly, 'critical',
    !title ? 'No title.'
      : genericWord ? `"${title}" is a placeholder title.`
      : brandOnly ? `"${title}" is brand-only (${titleWords} word${titleWords === 1 ? '' : 's'}). It should name the service and location — nobody searches a brand they haven't met yet.`
      : 'Descriptive.');

  const desc = metaContent(h, 'name', 'description');
  add('onpage', 'desc-exists', 'Meta description present', Boolean(desc), 'critical',
    desc ? `"${desc}"` : 'No meta description — Google will invent one from page text.');
  add('onpage', 'desc-length', 'Meta description within 120–160 characters',
    desc.length >= 120 && desc.length <= 160, 'warning',
    `Description is ${desc.length} characters.`);

  const h1Count = countTags(html, 'h1');
  add('onpage', 'h1-single', 'Exactly one H1 heading', h1Count === 1, 'warning',
    `Found ${h1Count} H1 tag(s).`, true);
  const h1Text = tagText(html, 'h1');
  add('onpage', 'h1-distinct', 'H1 differs from the title tag',
    Boolean(h1Text) && h1Text.toLowerCase().trim() !== titleLower.trim(), 'minor',
    'A duplicated H1 and title wastes a chance to target a second phrase.', true);

  const h2Count = countTags(html, 'h2');
  add('onpage', 'heading-structure', 'At least 3 H2 sections', h2Count >= 3, 'warning',
    `Found ${h2Count} H2 tag(s). Thin structure limits topical coverage.`, true);
  // A skipped level (h1 -> h3) breaks the document outline for crawlers and screen readers.
  const headingSeq = [...html.matchAll(/<h([1-6])[\s>]/gi)].map((m) => Number(m[1]));
  let skipped = false;
  for (let i = 1; i < headingSeq.length; i++) {
    if (headingSeq[i] - headingSeq[i - 1] > 1) { skipped = true; break; }
  }
  add('onpage', 'heading-order', 'No skipped heading levels', !skipped, 'minor',
    skipped ? 'Heading levels jump (e.g. H1 straight to H3).' : 'Hierarchy is sequential.', true);

  /* — Content — */
  const words = wordCountRaw;
  add('content', 'word-count', 'At least 600 words of content', words >= 600, 'warning',
    `Approximately ${words} words. Thin pages rarely outrank thorough competitors.`, true);
  add('content', 'word-count-depth', 'At least 1,000 words (in-depth)', words >= 1000, 'minor',
    `Approximately ${words} words.`, true);

  const imgs = collectImages(html);
  const imgsWithAlt = imgs.filter((i) => i.hasAlt).length;
  add('content', 'img-alt', 'Every image has descriptive alt text',
    imgs.length === 0 || imgsWithAlt === imgs.length, 'warning',
    imgs.length ? `${imgsWithAlt} of ${imgs.length} images have alt text.` : 'No images found.', true);
  // Legacy JPEG/PNG is one of the most common causes of a poor LCP.
  const modernImgs = imgs.filter((i) => i.modern).length;
  add('content', 'img-format', 'Images use modern formats (WebP/AVIF)',
    imgs.length === 0 || modernImgs / imgs.length >= 0.5, 'warning',
    imgs.length ? `${modernImgs} of ${imgs.length} images use WebP or AVIF.` : 'No images found.', true);
  const sizedImgs = imgs.filter((i) => i.sized).length;
  add('content', 'img-dimensions', 'Images declare width and height',
    imgs.length === 0 || sizedImgs / imgs.length >= 0.8, 'warning',
    imgs.length ? `${sizedImgs} of ${imgs.length} images set dimensions. Missing ones cause layout shift.` : 'No images.', true);

  const internalLinks = (html.match(/<a[^>]+href=["'](\/|https?:\/\/[^"']*)["']/gi) || []).length;
  add('content', 'internal-links', 'At least 10 links for crawl paths', internalLinks >= 10, 'warning',
    `Found roughly ${internalLinks} links.`, true);

  add('content', 'lang', 'Page language declared',
    /<html[^>]+lang=["'][a-z-]+["']/i.test(html), 'minor', 'The <html> tag should declare lang.');
  add('content', 'main-landmark', 'Semantic <main> landmark present',
    /<main[\s>]/i.test(html), 'minor', 'A <main> landmark helps crawlers isolate primary content.', true);

  /* — Social (click-through, not ranking) — */
  const ogTitle = metaContent(h, 'property', 'og:title');
  const ogDesc = metaContent(h, 'property', 'og:description');
  const ogImage = metaContent(h, 'property', 'og:image');
  const ogUrl = metaContent(h, 'property', 'og:url');
  const twCard = metaContent(h, 'name', 'twitter:card');

  add('social', 'og-title', 'Open Graph title set', Boolean(ogTitle), 'minor', ogTitle || 'Missing.');
  add('social', 'og-desc', 'Open Graph description set', Boolean(ogDesc), 'minor', ogDesc || 'Missing.');
  add('social', 'og-image', 'Open Graph image set', Boolean(ogImage), 'warning',
    ogImage || 'Missing — shared links show no preview image.');
  // Relative og:image URLs silently break on every platform that scrapes them.
  add('social', 'og-image-absolute', 'Open Graph image uses an absolute URL',
    !ogImage || /^https?:\/\//i.test(ogImage), 'minor',
    ogImage && !/^https?:\/\//i.test(ogImage) ? `"${ogImage}" is relative — scrapers cannot resolve it.` : 'Absolute.');
  add('social', 'og-url', 'Open Graph URL set', Boolean(ogUrl), 'minor', ogUrl || 'Missing.');
  const ogW = parseInt(metaContent(h, 'property', 'og:image:width') || '0', 10);
  add('social', 'og-image-size', 'Open Graph image is at least 1200px wide',
    !ogImage || ogW === 0 || ogW >= 1200, 'minor',
    ogW && ogW < 1200
      ? `og:image is declared ${ogW}px wide. Under 1200px renders as a small thumbnail instead of a full card.`
      : 'Sized correctly or not declared.');
  add('social', 'og-image-https', 'Open Graph image served over HTTPS',
    !ogImage || !/^http:\/\//i.test(ogImage), 'minor',
    /^http:\/\//i.test(ogImage) ? 'og:image is served over plain http — some platforms refuse to load it.' : 'Secure.');
  add('social', 'twitter-card', 'Twitter Card configured', Boolean(twCard), 'minor', twCard || 'Missing.');

  /* — Structured data — */
  const ldBlocks = html.match(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi) || [];
  add('schema', 'schema-present', 'Structured data (JSON-LD) present', ldBlocks.length > 0, 'warning',
    ldBlocks.length ? `${ldBlocks.length} JSON-LD block(s) found.` : 'No structured data.');

  let validSchema = false;
  const types: string[] = [];
  let nodes: Array<Record<string, unknown>> = [];
  for (const b of ldBlocks) {
    try {
      const parsed = JSON.parse(b.replace(/<[^>]+>/g, ''));
      validSchema = true;
      const n = parsed['@graph'] ?? (Array.isArray(parsed) ? parsed : [parsed]);
      nodes = nodes.concat(n);
      types.push(...n.map((x: { '@type'?: string }) => x['@type']).filter(Boolean));
    } catch {
      /* leave validSchema false */
    }
  }
  add('schema', 'schema-valid', 'Structured data parses correctly',
    ldBlocks.length > 0 && validSchema, 'warning',
    validSchema ? `Types: ${types.join(', ')}` : 'JSON-LD present but failed to parse.');

  const bizNode = nodes.find((n) => /LocalBusiness|Organization/i.test(String(n['@type'] ?? '')));
  add('schema', 'schema-local', 'Business or LocalBusiness markup present', Boolean(bizNode), 'warning',
    bizNode ? `Found: ${types.join(', ')}` : 'No Organization or LocalBusiness markup.');
  // Google ignores business markup that lacks the properties it needs.
  add('schema', 'schema-address', 'Business markup includes a postal address',
    Boolean(bizNode && bizNode['address']), 'warning',
    bizNode?.['address'] ? 'Address present.' : 'No address property — Google cannot use this for local results.');
  add('schema', 'schema-phone', 'Business markup includes a telephone',
    Boolean(bizNode && (bizNode['telephone'] || bizNode['contactPoint'])), 'minor',
    bizNode?.['telephone'] ? 'Telephone present.' : 'No telephone property.');
  add('schema', 'schema-sameas', 'Business markup links social profiles (sameAs)',
    Boolean(bizNode && Array.isArray(bizNode['sameAs']) && (bizNode['sameAs'] as unknown[]).length > 0), 'minor',
    'sameAs links help Google connect the site to your verified profiles.');

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
  const criticalFails = allFailed.filter((c) => FATAL_CHECKS.has(c.id));

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


/* ── Site-level audit ─────────────────────────────────────────────────────── */

export interface PageAudit {
  url: string;
  score: number;
  grade: string;
  issues: number;
  criticalIssues: number;
}

export interface SiteAuditResult extends AuditResult {
  /** Per-page breakdown. First entry is the page the visitor entered. */
  pages: PageAudit[];
  pagesAudited: number;
  /** Worst-scoring page — usually where the real problem is. */
  weakestPage?: PageAudit;
}

/**
 * Combine several page audits into one site result.
 *
 * A single-page audit was the biggest accuracy gap in this tool: it scored a
 * homepage and presented the number as a site score. Businesses routinely have
 * a polished homepage and untouched service pages, which is precisely the work
 * being sold — so the homepage alone flatters the site and hides the pitch.
 *
 * Category scores are averaged across pages. Site-wide checks (HTTPS, robots,
 * sitemap, Core Web Vitals) are identical on every page, so averaging leaves
 * them unchanged; per-page checks (titles, headings, content) get smoothed,
 * which is the intent — one strong page can no longer carry the whole site.
 */
export function combineAudits(
  audits: DetailedAuditResult[],
  urls: string[]
): SiteAuditResult {
  if (audits.length === 0) throw new Error('combineAudits called with no audits');
  const primary = audits[0];
  if (audits.length === 1) {
    return {
      ...toPublicResult(primary),
      pages: [{
        url: urls[0], score: primary.overallScore, grade: primary.overallGrade,
        issues: primary.totalIssues, criticalIssues: primary.criticalIssues,
      }],
      pagesAudited: 1,
    };
  }

  const categories: CategoryResult[] = CATEGORIES.map((cat) => {
    const per = audits
      .map((a) => a.categories.find((c) => c.key === cat.key))
      .filter((c): c is CategoryResult => Boolean(c) && c!.assessed);
    if (per.length === 0) {
      return {
        key: cat.key, label: cat.label, blurb: cat.blurb, score: 0, grade: 'N/A',
        assessed: false, passed: 0, total: 0, issues: 0, criticalIssues: 0,
      };
    }
    const avg = Math.round(per.reduce((s, c) => s + c.score, 0) / per.length);
    return {
      key: cat.key,
      label: cat.label,
      blurb: cat.blurb,
      score: avg,
      grade: toGrade(avg),
      assessed: true,
      passed: per.reduce((s, c) => s + c.passed, 0),
      total: per.reduce((s, c) => s + c.total, 0),
      issues: per.reduce((s, c) => s + c.issues, 0),
      criticalIssues: per.reduce((s, c) => s + c.criticalIssues, 0),
    };
  });

  const assessed = categories.filter((c) => c.assessed);
  const catWeight = (k: string) => CATEGORIES.find((c) => c.key === k)?.weight ?? 0;
  const totalWeight = assessed.reduce((sum, c) => sum + catWeight(c.key), 0);
  const rawScore = totalWeight
    ? Math.round(assessed.reduce((sum, c) => sum + c.score * catWeight(c.key), 0) / totalWeight)
    : 0;

  // A fatal problem on ANY page caps the site. A noindex tag on a service page
  // is just as disqualifying for that page as it would be on the homepage.
  const criticalTotal = categories.reduce((s, c) => s + c.criticalIssues, 0);
  const anyNoindex = audits.some((a) =>
    a.checks.some((c) => c.id === 'indexable' && !c.passed)
  );
  let cap = 100;
  if (anyNoindex) cap = 35;
  else if (criticalTotal >= 2) cap = 45;
  else if (criticalTotal === 1) cap = 65;
  const finalScore = Math.min(rawScore, cap);

  const pages: PageAudit[] = audits.map((a, i) => ({
    url: urls[i] ?? a.finalUrl,
    score: a.overallScore,
    grade: a.overallGrade,
    issues: a.totalIssues,
    criticalIssues: a.criticalIssues,
  }));

  return {
    url: primary.url,
    finalUrl: primary.finalUrl,
    fetchedAt: new Date().toISOString(),
    overallScore: finalScore,
    overallGrade: toGrade(finalScore),
    totalIssues: audits.reduce((s, a) => s + a.totalIssues, 0),
    criticalIssues: criticalTotal,
    categories,
    javascriptRendered: audits.some((a) => a.javascriptRendered),
    vitals: primary.vitals,
    pages,
    pagesAudited: audits.length,
    weakestPage: [...pages].sort((a, b) => a.score - b.score)[0],
  };
}
