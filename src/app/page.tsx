import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import SeoAuditTool from "@/components/SeoAuditTool";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web Design & Local SEO Services | SiteBrew — Georgia & South Carolina",
  description:
    "SiteBrew builds custom websites and local SEO strategies for small businesses across Georgia and South Carolina. Get found on Google from day one.",
  alternates: { canonical: "https://sitebrew.co" },
  openGraph: {
    title: "Web Design & Local SEO Services | SiteBrew — Georgia & South Carolina",
    description:
      "SiteBrew builds custom websites and local SEO strategies for small businesses across Georgia and South Carolina. Get found on Google from day one.",
    type: "website",
    url: "https://sitebrew.co",
    siteName: "SiteBrew",
    locale: "en_US",
    images: [
      {
        url: "https://sitebrew.co/sitebrew-hero.webp",
        width: 1200,
        height: 630,
        alt: "SiteBrew — Web Design & Local SEO for Georgia & South Carolina",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@sitebrewco",
    title: "Web Design & Local SEO Services | SiteBrew — Georgia & South Carolina",
    description:
      "SiteBrew builds custom websites and local SEO strategies for small businesses across Georgia and South Carolina. Get found on Google from day one.",
    images: ["https://sitebrew.co/sitebrew-hero.webp"],
  },
};

const packages = [
  {
    name: "Starter Site",
    price: "One-Time Fee",
    badge: "One-Time",
    priceNote: "$999 one-time",
    description:
      "Everything you need to launch a polished, professional website that ranks from day one — no recurring fees. Best suited for businesses that are just getting started online and need a solid foundation without an ongoing commitment.",
    features: [
      "Custom website design (mobile-first)",
      "On-page SEO setup & meta tags",
      "Google Business Profile optimisation",
      "Fast, secure hosting setup",
      "Contact form & click-to-call",
      "One round of revisions",
    ],
    notFor: "Not the right fit if you need ongoing monthly content updates, active SEO management, or ongoing support beyond launch.",
  },
  {
    name: "Growth Plan",
    price: "Monthly Retainer",
    badge: "Most Popular",
    priceNote: "$800 + $125/mo retainer",
    description:
      "Your website, maintained and improved every month so it keeps climbing local search rankings across Georgia and South Carolina. Ideal for established businesses that want to stay ahead of local competitors and keep their site performing long after launch.",
    features: [
      "Everything in Starter Site",
      "Monthly content & SEO updates",
      "Performance & speed monitoring",
      "Google ranking reports",
      "Priority support & edits",
      "Ongoing technical maintenance",
    ],
    notFor: "Not the right fit if you prefer a one-time build with no recurring commitment and plan to manage updates and SEO yourself.",
  },
];

const caseStudies = [
  {
    name: "Horner Wilson Construction",
    url: "https://hornerwilson.com",
    image: "",
    result: "A polished, mobile-first website for a Georgia construction company — organic traffic increased 340% in the first 3 months with built-in local SEO.",
  },
  {
    name: "Lake Blue Ridge Concert Series",
    url: "https://lakeblueridgeconcertseries.com",
    image: "",
    result: "A seasonal event website with integrated ticketing, lineup pages, and venue info — concert attendance grew 60% year-over-year after the redesign.",
  },
  {
    name: "Branham Group",
    url: "https://branham-group.com",
    image: "",
    result: "A full-service business site with lead generation at its core — drove 50+ qualified inquiries within the first month of launch.",
  },
];

const faqs = [
  {
    question: "How long does it take to launch my website?",
    answer: "Most websites are designed, built, and launched within 2–3 weeks after our initial discovery call. We follow a streamlined process: discovery, design, build, review, and launch. Complex sites with additional functionality may take slightly longer, and we'll set clear expectations upfront.",
  },
  {
    question: "What happens if I'm not happy with the design?",
    answer: "We don't launch anything you don't love. Every package includes a round of revisions so you can provide feedback and we'll refine until it's right. If after revisions you still feel it's not the right fit, we'll part ways amicably — you only pay for the work completed up to that point.",
  },
  {
    question: "Who owns the website after it's built?",
    answer: "You own everything you paid for — the design, code, and content — 100%. There are no licensing fees or lock-in contracts. For Starter Site clients, the site is yours to take anywhere. For Growth Plan clients, we host and maintain the site on our infrastructure while you're on the monthly plan, so you get ongoing updates, security, and performance monitoring included.",
  },
  {
    question: "What's included in ongoing support?",
    answer: "For Growth Plan clients, support includes monthly content updates, SEO improvements, speed monitoring, Google ranking reports, technical maintenance (security patches, backups, uptime monitoring), and priority email support. Starter Site clients receive support during the build process and can request paid edits as needed after launch.",
  },
];



const steps = [
  "Discovery call to understand your business goals and target audience.",
  "Custom design, copy, and SEO strategy tailored to your services.",
  "Build, launch, and maintain — we keep your site growing.",
];

export default function Home() {
  return (
    <div className="sitebrew-page min-h-screen">
      <header className="sticky top-0 z-30 border-b border-white/20 bg-[#f5f1e8]/90 backdrop-blur">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 md:px-10">
          <a href="#" className="flex items-center gap-3">
            <Image
              src="/sitebrew-logo-nav.png"
              alt="SiteBrew logo"
              width={48}
              height={48}
              className="h-11 w-11 object-contain"
            />
            <span className="font-mono text-lg font-semibold tracking-wide text-[#1f2e8c]">
              SITEBREW
            </span>
          </a>
          <div className="hidden items-center gap-6 text-sm font-medium text-[#241912] md:flex">
            <a href="#services" className="hover:text-[#1f2e8c]">
              Services
            </a>
            <a href="#work" className="hover:text-[#1f2e8c]">
              Our Work
            </a>
            <a href="#process" className="hover:text-[#1f2e8c]">
              Process
            </a>
            <a href="#faq" className="hover:text-[#1f2e8c]">
              FAQ
            </a>
            <a href="#about" className="hover:text-[#1f2e8c]">
              About
            </a>
            <Link href="/blog" className="hover:text-[#1f2e8c]">
              Blog
            </Link>
            <a href="#contact" className="hover:text-[#1f2e8c]">
              Contact
            </a>
          </div>
          <a
            href="#contact"
            className="rounded-full bg-[#1f2e8c] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#152263]"
          >
            Book a Call
          </a>
        </nav>
      </header>

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-[#eef1fc] via-[#f5f1e8] to-[#fdf3e3]">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:px-10 md:py-24">
            <div className="reveal-up space-y-6">
              <p className="inline-block rounded-full border border-[#1f2e8c]/30 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#1f2e8c]">
                Web Design &amp; Local SEO — Georgia &amp; South Carolina
              </p>
              <h1 className="font-mono text-4xl leading-tight text-[#1a130e] md:text-6xl">
                Web design &amp; local SEO that gets Georgia &amp; South Carolina businesses found on Google.
              </h1>
              <p className="max-w-xl text-lg text-[#4f4036]">
                SiteBrew builds custom websites with built-in SEO for small businesses
                across Georgia and South Carolina — Atlanta, Savannah, Charleston,
                Columbia, and everywhere in between — so you get found from day one.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#audit"
                  className="rounded-full bg-[#1f2e8c] px-6 py-3 font-semibold text-white transition hover:bg-[#152263]"
                >
                  Get Your Free Audit
                </a>
                <a
                  href="#services"
                  className="rounded-full border border-[#1f2e8c]/30 bg-white/70 px-6 py-3 font-semibold text-[#1f2e8c] transition hover:bg-white"
                >
                  Explore Services
                </a>
              </div>
            </div>
            <div className="reveal-up-delayed flex items-center justify-center">
              <div className="w-full max-w-sm rounded-[2rem] border border-[#1f2e8c]/20 bg-white/80 p-6 shadow-[0_18px_60px_-24px_rgba(31,46,140,0.5)]">
                <Image
                  src="/sitebrew-hero.webp"
                  alt="SiteBrew coffee cup logo"
                  width={400}
                  height={400}
                  priority
                  className="mx-auto h-auto w-full max-w-[260px] object-contain"
                />
                <p className="mt-4 text-center text-sm text-[#4f4036]">
                  Built with purpose, brewed for growth.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Marquee Banner ── */}
        <div className="overflow-hidden border-y border-[#1f2e8c]/15 bg-[#1f2e8c] py-3">
          <div className="flex w-max animate-marquee gap-0">
            {[...Array(2)].map((_, i) => (
              <ul key={i} className="flex shrink-0 items-center gap-0">
                {[
                  "⚡ Fast Loading Websites",
                  "🔍 Built-in SEO",
                  "📱 Mobile-First Design",
                  "📈 Google Rankings",
                  "🛡️ Secure & Reliable",
                  "🎨 Custom Design",
                  "📍 Local SEO Experts",
                  "💬 Priority Support",
                  "🚀 Launch in Weeks",
                  "📊 Monthly Reports",
                ].map((item) => (
                  <li key={item} className="flex items-center">
                    <span className="whitespace-nowrap px-6 text-sm font-semibold tracking-wide text-white/90">
                      {item}
                    </span>
                    <span className="text-[#4f6aff] text-lg">✦</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        <SeoAuditTool />

        <section id="services" className="bg-gradient-to-b from-[#f0f4ff] to-[#f5f1e8] py-16">
          <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
          <h2 className="font-mono text-3xl text-[#1a130e] md:text-4xl">
            Our Packages
          </h2>
          <p className="mt-3 max-w-xl text-[#4f4036]">
            Two straightforward options — whether you need a great website built
            once, or want us by your side every month.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {packages.map((pkg) => (
              <article
                key={pkg.name}
                className="flex flex-col overflow-hidden rounded-3xl border border-[#1f2e8c]/20 bg-white/80 shadow-[0_14px_44px_-24px_rgba(31,46,140,0.55)]"
              >
                <div className={`h-2 w-full ${pkg.name === "Growth Plan" ? "bg-gradient-to-r from-[#1f2e8c] to-[#4f6aff]" : "bg-gradient-to-r from-[#c8904e] to-[#f0b87a]"}`} />
                <div className="flex flex-col flex-1 p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block rounded-full bg-[#1f2e8c]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#1f2e8c]">
                      {pkg.badge}
                    </span>
                    <h3 className="mt-3 font-mono text-2xl font-semibold text-[#1a130e]">
                      {pkg.name}
                    </h3>
                  </div>
                  <span className="rounded-full bg-[#1f2e8c] px-4 py-2 text-sm font-bold text-white">
                    {pkg.price}
                  </span>
                </div>
                <p className="mt-1 text-lg font-bold text-[#1f2e8c]">{pkg.priceNote}</p>
                <p className="mt-3 text-[#4f4036]">{pkg.description}</p>
                <p className="mt-3 text-sm italic text-[#8a7a6e]">{pkg.notFor}</p>
                <ul className="mt-6 space-y-2 flex-1">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[#4f4036]">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#1f2e8c]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className="mt-8 block rounded-full bg-[#1f2e8c] px-6 py-3 text-center font-semibold text-white transition hover:bg-[#152263]"
                >
                  Get a Quote
                </a>
                </div>
              </article>
            ))}
          </div>
          </div>
        </section>

        {/* ── Our Work / Case Studies ── */}
        <section id="work" className="bg-gradient-to-b from-[#f5f1e8] to-[#f0f4ff] py-16">
          <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
            <h2 className="font-mono text-3xl text-[#1a130e] md:text-4xl">
              Our Work
            </h2>
            <p className="mt-3 max-w-xl text-[#4f4036]">
              Real websites we&apos;ve built for local businesses across Georgia and South Carolina — each designed to drive real results.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {caseStudies.map((cs) => (
                <a
                  key={cs.name}
                  href={cs.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col rounded-3xl border border-[#1f2e8c]/20 bg-white/80 p-7 shadow-[0_14px_44px_-24px_rgba(31,46,140,0.35)] transition hover:shadow-[0_20px_60px_-20px_rgba(31,46,140,0.5)] hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1f2e8c]/10 text-sm font-bold text-[#1f2e8c]">
                      {cs.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1a130e] group-hover:text-[#1f2e8c] transition">
                        {cs.name}
                      </h3>
                      <p className="text-xs text-[#4f4036]/60 break-all">{cs.url.replace("https://", "")}</p>
                    </div>
                  </div>
                  <p className="mt-5 flex-1 text-sm text-[#4f4036] leading-relaxed">{cs.result}</p>
                  <span className="mt-4 inline-block text-xs font-semibold text-[#1f2e8c] group-hover:underline">View site →</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="process" className="mx-auto w-full max-w-6xl px-6 pb-16 md:px-10">
          <div className="rounded-[2rem] border border-[#1f2e8c]/20 bg-gradient-to-br from-[#1f2e8c] to-[#2d45c4] p-8 md:p-10">
            <h2 className="font-mono text-3xl text-white md:text-4xl">
              Our Process
            </h2>
            <ol className="mt-6 grid gap-4 md:grid-cols-3">
              {steps.map((step, index) => {
                const colors = ["from-[#f0b87a] to-[#c8904e]", "from-[#7aa4f0] to-[#4f6aff]", "from-[#7aecd4] to-[#2ab89a]"];
                return (
                  <li
                    key={step}
                    className="rounded-2xl bg-white/10 backdrop-blur p-5 border border-white/20"
                  >
                    <div className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${colors[index]} text-white text-sm font-bold mb-3`}>
                      {index + 1}
                    </div>
                    <p className="text-white/90">{step}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* ── Who We Are ── */}
        <section id="about" className="mx-auto w-full max-w-6xl px-6 pb-16 md:px-10">
          <div className="rounded-[2rem] border border-[#1f2e8c]/20 bg-[#fffaf1]/90 p-8 md:p-12">
            <p className="inline-block rounded-full border border-[#1f2e8c]/30 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#1f2e8c]">
              The Team
            </p>
            <h2 className="font-mono mt-4 text-3xl text-[#1a130e] md:text-4xl">
              Who We Are
            </h2>
            <p className="mt-4 max-w-2xl text-[#4f4036]">
              SiteBrew was born from a simple idea: local businesses deserve websites that
              actually work. We combined two obsessions — clean code and search
              visibility — to build a studio that serves small businesses across
              Georgia and South Carolina.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {/* Carter */}
              <div className="flex flex-col rounded-3xl border border-[#1f2e8c]/20 bg-white p-8 shadow-[0_14px_44px_-24px_rgba(31,46,140,0.25)]">
                <h3 className="text-xl font-semibold text-[#1a130e]">Carter Wilson</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-[#1f2e8c]/60">Founder · Web Development</p>
                <p className="mt-4 text-[#4f4036]">
                  Carter turns designs into fast, reliable websites. With a focus on
                  clean architecture and mobile-first development, he ensures every
                  SiteBrew site loads quickly, looks sharp, and is built to last.
                </p>
                <a href="mailto:carter@sitebrew.co" className="mt-4 inline-block text-sm font-semibold text-[#1f2e8c] hover:underline">
                  carter@sitebrew.co
                </a>
              </div>
              {/* David */}
              <div className="flex flex-col rounded-3xl border border-[#1f2e8c]/20 bg-white p-8 shadow-[0_14px_44px_-24px_rgba(31,46,140,0.25)]">
                <h3 className="text-xl font-semibold text-[#1a130e]">David Bouse</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-[#1f2e8c]/60">Co-Founder · SEO & Growth</p>
                <p className="mt-4 text-[#4f4036]">
                  David&apos;s background in SEO and online marketing is what sparked
                  SiteBrew. He crafts the strategies that get our clients found on
                  Google — and keeps them climbing the rankings long after launch.
                </p>
                <a href="mailto:david@sitebrew.co" className="mt-4 inline-block text-sm font-semibold text-[#1f2e8c] hover:underline">
                  david@sitebrew.co
                </a>
              </div>
            </div>

            {/* LinkedIn CTA */}
            <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-[#1f2e8c]/15 bg-gradient-to-r from-[#eef1fc] to-[#f5f1e8] px-8 py-6 sm:flex-row sm:justify-between">
              <div>
                <p className="font-semibold text-[#1a130e]">Follow SiteBrew on LinkedIn</p>
                <p className="mt-1 text-sm text-[#4f4036]">Web design tips, local SEO insights, and small business news across Georgia &amp; South Carolina — straight to your feed.</p>
              </div>
              <a
                href="https://www.linkedin.com/company/sitebrewco"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow SiteBrew on LinkedIn"
                className="inline-flex shrink-0 items-center gap-2.5 rounded-full bg-[#0077b5] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#005f8e]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Follow on LinkedIn
              </a>
            </div>
          </div>
        </section>

        {/* ── Service Areas ── */}
        <section className="bg-gradient-to-br from-[#1f2e8c] to-[#2d45c4] py-14">
          <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
            <div className="text-center mb-10">
              <p className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/80">
                Where We Work
              </p>
              <h2 className="font-mono mt-4 text-3xl text-white md:text-4xl">Serving Georgia &amp; South Carolina</h2>
              <p className="mt-3 text-white/70 max-w-xl mx-auto">
                We work with small businesses across both states — from metro Atlanta to coastal Charleston and everywhere in between.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {/* Georgia */}
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Georgia</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Atlanta",
                    "Savannah",
                    "Augusta",
                    "Columbus",
                    "Macon",
                    "Athens",
                    "Roswell",
                    "Alpharetta",
                    "Marietta",
                    "Gainesville",
                  ].map((area) => (
                    <div key={area} className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium text-white backdrop-blur">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#7aa4f0]" />
                      {area}
                    </div>
                  ))}
                </div>
              </div>
              {/* South Carolina */}
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/50">South Carolina</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Charleston",
                    "Columbia",
                    "Greenville",
                    "Mount Pleasant",
                    "North Charleston",
                    "Summerville",
                    "Myrtle Beach",
                    "Hilton Head",
                    "Spartanburg",
                    "James Island",
                  ].map((area) => (
                    <div key={area} className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium text-white backdrop-blur">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#7aa4f0]" />
                      {area}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="bg-gradient-to-b from-[#f5f1e8] to-[#fffaf1] py-16">
          <div className="mx-auto w-full max-w-3xl px-6 md:px-10">
            <div className="text-center mb-10">
              <p className="inline-block rounded-full border border-[#1f2e8c]/30 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#1f2e8c]">
                FAQs
              </p>
              <h2 className="font-mono mt-4 text-3xl text-[#1a130e] md:text-4xl">
                Common Questions
              </h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-2xl border border-[#1f2e8c]/15 bg-white/70 p-5 transition hover:bg-white/90 open:bg-white"
                >
                  <summary className="flex cursor-pointer items-center justify-between font-semibold text-[#1a130e] list-none">
                    {faq.question}
                    <svg className="h-5 w-5 shrink-0 text-[#1f2e8c] transition group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-[#4f4036]">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="mx-auto w-full max-w-6xl px-6 py-20 md:px-10">
          <div className="grid gap-6 rounded-[2rem] border border-[#1f2e8c]/20 bg-white/90 p-8 md:grid-cols-2 md:p-10">
            <div>
              <h2 className="font-mono text-3xl text-[#1a130e] md:text-4xl">
                Ready for a Website That Works?
              </h2>
              <p className="mt-4 text-[#4f4036]">
                Tell us about your business and we&apos;ll get back to you with
                the right package and a custom quote.
              </p>
              <p className="mt-6 text-sm font-semibold text-[#1f2e8c]">
                Email: hello@sitebrew.co
              </p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="border-t border-[#1f2e8c]/10 bg-[#0e1a5c] text-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-14 md:px-10">

          {/* Top row */}
          <div className="grid gap-10 md:grid-cols-3 lg:grid-cols-4">

            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3">
                <Image src="/sitebrew-logo-nav.png" alt="SiteBrew logo" width={40} height={40} className="h-10 w-10 object-contain brightness-0 invert" />
                <span className="font-mono text-lg font-semibold tracking-wide">SITEBREW</span>
              </div>
              <p className="mt-4 text-sm text-white/60 max-w-xs">
                Web design &amp; local SEO for small businesses across Georgia and South Carolina.
              </p>
              <a
                href="https://www.linkedin.com/company/sitebrewco"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="SiteBrew on LinkedIn"
                className="mt-5 inline-flex items-center gap-2.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-[#0077b5] hover:border-[#0077b5] hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Follow on LinkedIn
              </a>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#services" className="hover:text-white transition">Our Packages</a></li>
                <li><a href="#process" className="hover:text-white transition">Our Process</a></li>
                <li><a href="#about" className="hover:text-white transition">About Us</a></li>
                <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
                <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>

            {/* Service Areas */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Service Areas</h4>
              <ul className="space-y-1 text-sm text-white/70">
                <li className="text-white/40 text-xs uppercase tracking-widest pt-1 pb-0.5">Georgia</li>
                {["Atlanta", "Savannah", "Augusta", "Marietta", "Alpharetta"].map(area => (
                  <li key={area}>{area}, GA</li>
                ))}
                <li className="text-white/40 text-xs uppercase tracking-widest pt-3 pb-0.5">South Carolina</li>
                {["Charleston", "Columbia", "Greenville", "Mount Pleasant", "Myrtle Beach"].map(area => (
                  <li key={area}>{area}, SC</li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Get In Touch</h4>
              <ul className="space-y-3 text-sm text-white/70">
                <li>
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-0.5">General</p>
                  <a href="mailto:hello@sitebrew.co" className="hover:text-white transition">hello@sitebrew.co</a>
                </li>
                <li>
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-0.5">Carter Wilson — Founder</p>
                  <a href="mailto:carter@sitebrew.co" className="hover:text-white transition block">carter@sitebrew.co</a>
                  <a href="tel:+17703121971" className="hover:text-white transition block">(770) 312-1971</a>
                </li>
                <li>
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-0.5">David Bouse — Co-Founder</p>
                  <a href="mailto:david@sitebrew.co" className="hover:text-white transition block">david@sitebrew.co</a>
                  <a href="tel:+16787617848" className="hover:text-white transition block">(678) 761-7848</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 border-t border-white/10 pt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-xs text-white/40">
            <p>© {new Date().getFullYear()} SiteBrew Company. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <p>Web Design &amp; Local SEO · Georgia &amp; South Carolina</p>
              <a
                href="https://www.linkedin.com/company/sitebrewco"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="SiteBrew on LinkedIn"
                className="flex items-center gap-1.5 text-white/40 transition hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
