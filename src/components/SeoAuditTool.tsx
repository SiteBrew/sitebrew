"use client";

import { useState } from "react";
import Link from "next/link";
import type { SiteAuditResult } from "@/lib/seo-audit";

const GRADE_STYLES: Record<string, { ring: string; text: string; bar: string }> = {
  A: { ring: "border-[#2ab89a]", text: "text-[#2ab89a]", bar: "from-[#7aecd4] to-[#2ab89a]" },
  B: { ring: "border-[#4f6aff]", text: "text-[#4f6aff]", bar: "from-[#7aa4f0] to-[#4f6aff]" },
  C: { ring: "border-[#c8904e]", text: "text-[#c8904e]", bar: "from-[#f0b87a] to-[#c8904e]" },
  D: { ring: "border-[#e08a4a]", text: "text-[#e08a4a]", bar: "from-[#f0b87a] to-[#e08a4a]" },
  F: { ring: "border-[#d9534f]", text: "text-[#d9534f]", bar: "from-[#f0918e] to-[#d9534f]" },
  "N/A": { ring: "border-[#4f4036]/30", text: "text-[#4f4036]/50", bar: "from-[#ddd] to-[#bbb]" },
};

const gradeStyle = (g: string) => GRADE_STYLES[g] ?? GRADE_STYLES["N/A"];

/*
 * Copy is calibrated to a deliberately strict scale. Typical small-business
 * sites land in the 35-55 range, so the low-score language has to read as
 * "here is the opportunity", not "your site is broken" — the latter is both
 * inaccurate and a bad first impression.
 */
function verdict(score: number) {
  if (score >= 90) return "Exceptional. This is in the top few percent of sites we check.";
  if (score >= 80) return "Strong. Ahead of nearly every local competitor.";
  if (score >= 65) return "Above average, with clear room to pull ahead.";
  if (score >= 50) return "Typical for a small-business site — and that's the opportunity.";
  if (score >= 35) return "Below par. Several fixable things are limiting your visibility.";
  return "Significant gaps are working against you in search.";
}

export default function SeoAuditTool() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SiteAuditResult | null>(null);
  const [easterEgg, setEasterEgg] = useState<{ hostname: string; message: string } | null>(null);

  const runAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !url.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setEasterEgg(null);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Audit failed");
      // Someone pointed the auditor at us.
      if (data.easterEgg) {
        setEasterEgg({ hostname: data.hostname, message: data.message });
        return;
      }
      setResult(data as SiteAuditResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const overall = result ? gradeStyle(result.overallGrade) : null;

  return (
    <section id="audit" className="mx-auto w-full max-w-6xl px-6 pb-16 md:px-10">
      <div className="rounded-[2rem] border border-[#1f2e8c]/20 bg-gradient-to-br from-[#1f2e8c] to-[#2d45c4] p-8 md:p-10">
        <div className="max-w-2xl">
          <p className="font-mono text-sm uppercase tracking-widest text-[#f0b87a]">
            Free Instant Health Check
          </p>
          <h2 className="mt-2 font-mono text-3xl text-white md:text-4xl">
            How healthy is your website?
          </h2>
          <p className="mt-4 text-white/80">
            Enter your address and we&apos;ll run live checks on your technical setup,
            on-page structure, and Google&apos;s Core Web Vitals — the page-experience signals
            Google confirms it ranks on. We check several pages, not just the homepage.
            No email required.
          </p>
        </div>

        {/* Input */}
        <form onSubmit={runAudit} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <label htmlFor="audit-url" className="sr-only">
            Your website address
          </label>
          <input
            id="audit-url"
            type="text"
            inputMode="url"
            autoComplete="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="yourbusiness.com"
            className="flex-1 rounded-full border border-white/25 bg-white/10 px-6 py-4 text-white placeholder-white/50 backdrop-blur outline-none transition focus:border-[#f0b87a] focus:bg-white/15"
          />
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="rounded-full bg-gradient-to-br from-[#f0b87a] to-[#c8904e] px-8 py-4 font-semibold text-[#1a130e] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Analysing…" : "Check My Site"}
          </button>
        </form>

        {loading && (
          <p className="mt-4 text-sm text-white/60">
            Fetching your pages and running Google&apos;s speed test — this takes
            up to 30 seconds.
          </p>
        )}

        {error && (
          <p role="alert" className="mt-4 rounded-2xl bg-white/10 px-5 py-3 text-sm text-[#ffd9d8]">
            {error}
          </p>
        )}

        {/* Easter egg — auditing SiteBrew itself */}
        {easterEgg && (
          <div className="mt-10 flex flex-col items-center gap-6 rounded-2xl border border-[#f0b87a]/40 bg-white/10 p-8 backdrop-blur text-center sm:flex-row sm:text-left">
            <div className="flex h-28 w-28 flex-none items-center justify-center rounded-full border-4 border-[#f0b87a] bg-white">
              <div className="leading-none">
                <div className="font-mono text-4xl font-bold text-[#c8904e]">A+</div>
                <div className="mt-1 text-xs text-[#4f4036]/70">100/100</div>
              </div>
            </div>
            <div>
              <p className="font-mono text-xl text-white">{easterEgg.hostname}</p>
              <p className="mt-2 text-lg text-[#f0b87a]">{easterEgg.message}</p>
              <p className="mt-3 text-sm text-white/70">
                Now put your <em>actual</em> site in and let&apos;s see what we&apos;re working with.
              </p>
              <button
                onClick={() => {
                  setEasterEgg(null);
                  setUrl("");
                }}
                className="mt-5 rounded-full bg-gradient-to-br from-[#f0b87a] to-[#c8904e] px-6 py-3 text-sm font-semibold text-[#1a130e] transition hover:brightness-105"
              >
                Fine, I&apos;ll check mine
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {result && overall && (
          <div className="mt-10">
            {/* Overall */}
            <div className="flex flex-col items-center gap-6 rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur sm:flex-row sm:items-center">
              <div
                className={`flex h-28 w-28 flex-none items-center justify-center rounded-full border-4 bg-white ${overall.ring}`}
              >
                <div className="text-center leading-none">
                  <div className={`font-mono text-4xl font-bold ${overall.text}`}>
                    {result.overallGrade}
                  </div>
                  <div className="mt-1 text-xs text-[#4f4036]/70">{result.overallScore}/100</div>
                </div>
              </div>
              <div className="text-center sm:text-left">
                <p className="font-mono text-xl text-white">
                  {new URL(result.finalUrl).hostname}
                </p>
                <p className="mt-1 text-white/80">{verdict(result.overallScore)}</p>
                <p className="mt-2 text-xs text-white/50">
                  Scored on a strict scale — most small-business sites land between 35 and 55.
                  Above 90 is near-perfect.
                </p>
                <p className="mt-3 text-sm text-[#f0b87a]">
                  {result.totalIssues === 0
                    ? "No issues detected in our checks."
                    : `${result.totalIssues} issue${result.totalIssues === 1 ? "" : "s"} found` +
                      (result.criticalIssues > 0
                        ? ` — ${result.criticalIssues} critical`
                        : "")}
                </p>
              </div>
            </div>

            {/* Core Web Vitals — real numbers, shown plainly */}
            {result.vitals && (
              <div className="mt-4 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold text-white">Core Web Vitals</h3>
                  <span className="text-xs text-white/60">
                    {result.vitals.source === "field"
                      ? "Real Chrome user data (last 28 days)"
                      : "Lab simulation \u2014 not enough traffic for real-user data"}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "LCP", value: result.vitals.lcp, unit: "s", good: 2.5, fmt: (v: number) => v.toFixed(2) },
                    { label: "CLS", value: result.vitals.cls, unit: "", good: 0.1, fmt: (v: number) => v.toFixed(3) },
                    {
                      label: result.vitals.source === "field" ? "INP" : "TBT",
                      value: result.vitals.inp,
                      unit: "ms",
                      good: result.vitals.source === "field" ? 200 : 200,
                      fmt: (v: number) => String(Math.round(v)),
                    },
                    { label: "Perf", value: result.vitals.performanceScore, unit: "/100", good: undefined, fmt: (v: number) => String(Math.round(v)) },
                  ]
                    .filter((m) => typeof m.value === "number")
                    .map((m) => {
                      const v = m.value as number;
                      const ok = m.good === undefined ? v >= 90 : v <= m.good;
                      return (
                        <div key={m.label} className="rounded-xl bg-white/10 p-3 text-center">
                          <div className="text-xs uppercase tracking-wider text-white/60">{m.label}</div>
                          <div className={`mt-1 font-mono text-lg font-bold ${ok ? "text-[#7aecd4]" : "text-[#f0b87a]"}`}>
                            {m.fmt(v)}
                            <span className="text-xs font-normal text-white/50">{m.unit}</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Categories */}
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {result.categories.map((cat) => {
                const s = gradeStyle(cat.grade);
                return (
                  <div
                    key={cat.key}
                    className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-white">{cat.label}</h3>
                        <p className="mt-1 text-sm text-white/70">{cat.blurb}</p>
                      </div>
                      <div className="flex-none text-right">
                        <div className="font-mono text-2xl font-bold text-white">
                          {cat.assessed ? cat.grade : "—"}
                        </div>
                        {cat.assessed && (
                          <div className="text-xs text-white/60">{cat.score}/100</div>
                        )}
                      </div>
                    </div>

                    {cat.assessed ? (
                      <>
                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${s.bar}`}
                            style={{ width: `${cat.score}%` }}
                          />
                        </div>
                        <p className="mt-3 text-xs text-white/60">
                          {cat.issues === 0
                            ? `All ${cat.total} checks passed`
                            : `${cat.issues} of ${cat.total} checks need attention` +
                              (cat.criticalIssues > 0 ? ` · ${cat.criticalIssues} critical` : "")}
                        </p>
                      </>
                    ) : (
                      <p className="mt-4 text-xs text-white/60">
                        Not assessable from the page source.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {result.javascriptRendered && (
              <p className="mt-4 rounded-2xl bg-white/10 px-5 py-3 text-xs text-white/70">
                Note: this site renders its content with JavaScript. Google runs JavaScript and
                will see that content, so we&apos;ve excluded those checks rather than count them
                against you. A full audit covers them properly.
              </p>
            )}

            {/* Per-page breakdown — a strong homepage can hide weak service pages */}
            {result.pages && result.pages.length > 1 && (
              <div className="mt-4 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold text-white">
                    Pages checked ({result.pagesAudited})
                  </h3>
                  {result.weakestPage && (
                    <span className="text-xs text-white/60">
                      Weakest: {result.weakestPage.score}/100
                    </span>
                  )}
                </div>
                <ul className="mt-4 space-y-2">
                  {result.pages.map((pg) => {
                    let path = pg.url;
                    try {
                      path = new URL(pg.url).pathname || "/";
                    } catch {
                      /* keep raw */
                    }
                    const st = gradeStyle(pg.grade);
                    return (
                      <li
                        key={pg.url}
                        className="flex items-center justify-between gap-4 rounded-xl bg-white/10 px-4 py-3"
                      >
                        <span className="truncate font-mono text-sm text-white/85">{path}</span>
                        <span className="flex flex-none items-center gap-3">
                          <span className="text-xs text-white/60">
                            {pg.issues} issue{pg.issues === 1 ? "" : "s"}
                          </span>
                          <span className={`font-mono text-sm font-bold ${st.text.replace("text-", "text-")}`}>
                            {pg.score}
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Scope caveat — naming the gaps is what makes the CTA credible */}
            <div className="mt-4 rounded-2xl border border-white/15 bg-white/5 px-5 py-4">
              <p className="text-xs leading-relaxed text-white/70">
                <span className="font-semibold text-white/85">What this covers:</span> technical
                setup, on-page structure, and Core Web Vitals across the pages listed above. It does{" "}
                <span className="font-semibold text-white/85">not</span> measure backlinks, domain
                authority, your Google Business Profile, keyword relevance, or where you currently
                rank &mdash; and for local search those often matter more than everything above.
                We cover them in the full audit.
              </p>
            </div>

            {/* CTA */}
            <div className="mt-6 rounded-2xl border border-[#f0b87a]/40 bg-[#f5f1e8] p-6 md:p-8">
              <h3 className="font-mono text-xl text-[#1a130e] md:text-2xl">
                Want to know exactly what&apos;s holding it back?
              </h3>
              <p className="mt-3 text-[#4f4036]">
                This is the summary. The full audit names every issue found here, ranks them by
                real ranking impact, and adds the things this check can&apos;t see &mdash; your
                backlink profile, Google Business Profile, and how you rank against local
                competitors. We&apos;ll walk you through it and quote the work &mdash; no obligation.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="#contact"
                  className="rounded-full bg-gradient-to-br from-[#1f2e8c] to-[#2d45c4] px-7 py-3 font-semibold text-white transition hover:brightness-110"
                >
                  Get My Full Report &amp; Quote
                </Link>
                <button
                  onClick={() => {
                    setResult(null);
                    setUrl("");
                  }}
                  className="rounded-full border border-[#1f2e8c]/30 px-7 py-3 font-semibold text-[#1f2e8c] transition hover:bg-[#1f2e8c]/5"
                >
                  Check Another Site
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
