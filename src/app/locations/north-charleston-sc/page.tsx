import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web Design & Local SEO in North Charleston, SC | SiteBrew",
  description:
    "SiteBrew builds custom websites and local SEO strategies for small businesses in North Charleston, SC. Part of our Georgia & South Carolina network — stand out and get found on Google.",
  alternates: { canonical: "https://sitebrew.co/locations/north-charleston-sc" },
  openGraph: {
    title: "Web Design & Local SEO in North Charleston, SC | SiteBrew",
    description:
      "SiteBrew builds custom websites and local SEO strategies for small businesses in North Charleston, SC. Part of our Georgia & South Carolina network — stand out and get found on Google.",
    type: "website",
    url: "https://sitebrew.co/locations/north-charleston-sc",
    siteName: "SiteBrew",
    locale: "en_US",
    images: [
      {
        url: "https://sitebrew.co/sitebrew-hero.webp",
        width: 1200,
        height: 630,
        alt: "SiteBrew — Web Design & Local SEO for North Charleston, SC",
      },
    ],
  },
};

export default function NorthCharlestonPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Web Design & Local SEO — North Charleston, SC",
    "provider": {
      "@type": "LocalBusiness",
      "@id": "https://sitebrew.co/#business",
      "name": "SiteBrew Company",
      "url": "https://sitebrew.co",
    },
    "areaServed": {
      "@type": "City",
      "name": "North Charleston",
      "addressRegion": "SC",
      "addressCountry": "US",
    },
    "description":
      "SiteBrew builds custom, mobile-first websites with built-in local SEO for small businesses in North Charleston, SC — helping them stand out online, rank on Google, and turn website visitors into paying customers.",
    "url": "https://sitebrew.co/locations/north-charleston-sc",
  };

  return (
    <div className="sitebrew-page min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/20 bg-[#f5f1e8]/90 backdrop-blur">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 md:px-10">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/sitebrew-logo-nav.png" alt="SiteBrew logo" width={48} height={48} className="h-11 w-11 object-contain" />
            <span className="font-mono text-lg font-semibold tracking-wide text-[#1f2e8c]">SITEBREW</span>
          </Link>
          <div className="hidden items-center gap-6 text-sm font-medium text-[#241912] md:flex">
            <Link href="/#services" className="hover:text-[#1f2e8c]">Services</Link>
            <Link href="/#process" className="hover:text-[#1f2e8c]">Process</Link>
            <Link href="/#about" className="hover:text-[#1f2e8c]">About</Link>
            <Link href="/blog" className="hover:text-[#1f2e8c]">Blog</Link>
            <Link href="/#contact" className="hover:text-[#1f2e8c]">Contact</Link>
          </div>
          <Link href="/#contact" className="rounded-full bg-[#1f2e8c] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#152263]">
            Book a Call
          </Link>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#eef1fc] via-[#f5f1e8] to-[#fdf3e3] py-20 md:py-24">
          <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
            <p className="inline-block rounded-full border border-[#1f2e8c]/30 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#1f2e8c]">
              North Charleston, SC
            </p>
            <h1 className="font-mono mt-4 text-4xl leading-tight text-[#1a130e] md:text-5xl">
              Web Design &amp; Local SEO<br className="hidden md:block" /> for North Charleston Businesses.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-[#4f4036]">
              North Charleston is South Carolina&apos;s third-largest city and one of the most commercially active markets in the Charleston region. With thousands of businesses competing for local customers — from Tanger Outlets to Rivers Avenue corridor — standing out online isn&apos;t optional.
            </p>
            <p className="mt-4 max-w-2xl text-lg text-[#4f4036]">
              SiteBrew serves businesses across Georgia and South Carolina, and North Charleston is one of our key SC markets. We build websites specifically designed to rank for North Charleston&apos;s local search landscape. We target the right keywords, optimize your Google Business Profile for the neighborhoods you serve, and build a site that loads fast and converts well on mobile — where most of your customers are searching.
            </p>
            <p className="mt-4 max-w-2xl text-lg text-[#4f4036]">
              From HVAC companies and auto shops to restaurants and professional services, we help North Charleston businesses build a digital presence that drives real leads — not just traffic. Our approach is practical, local, and built around what actually moves the needle in competitive markets like yours.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/#contact" className="rounded-full bg-[#1f2e8c] px-6 py-3 font-semibold text-white transition hover:bg-[#152263]">
                Get Your Free Audit
              </Link>
              <Link href="/#services" className="rounded-full border border-[#1f2e8c]/30 bg-white/70 px-6 py-3 font-semibold text-[#1f2e8c] transition hover:bg-white">
                View Our Packages
              </Link>
            </div>
          </div>
        </section>

        {/* Why SiteBrew for North Charleston */}
        <section className="mx-auto w-full max-w-6xl px-6 py-16 md:px-10">
          <h2 className="font-mono text-3xl text-[#1a130e] md:text-4xl">Why North Charleston Businesses Choose SiteBrew</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: "🏙️",
                title: "Built for Competitive Markets",
                body: "North Charleston is busy. We build websites engineered to rank above local competitors and capture high-intent searches in your specific area.",
              },
              {
                icon: "📱",
                title: "Mobile-First, Always",
                body: "The majority of North Charleston searches happen on smartphones. Our sites load in under 2 seconds on mobile and convert visitors into customers.",
              },
              {
                icon: "🗺️",
                title: "Hyper-Local Targeting",
                body: "We optimize for the neighborhoods and corridors you actually serve — Dorchester Road, Ashley Phosphate, Park Circle, and beyond.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-[#1f2e8c]/15 bg-white p-8 shadow-[0_14px_44px_-24px_rgba(31,46,140,0.2)]">
                <span className="text-3xl">{item.icon}</span>
                <h3 className="font-mono mt-4 text-xl font-semibold text-[#1a130e]">{item.title}</h3>
                <p className="mt-3 text-[#4f4036]">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section id="contact" className="mx-auto w-full max-w-6xl px-6 py-16 md:px-10">
          <div className="grid gap-6 rounded-[2rem] border border-[#1f2e8c]/20 bg-white/90 p-8 md:grid-cols-2 md:p-10">
            <div>
              <h2 className="font-mono text-3xl text-[#1a130e] md:text-4xl">
                Ready to grow your North Charleston business?
              </h2>
              <p className="mt-4 text-[#4f4036]">
                Tell us about your business and we&apos;ll come back with a free audit and a custom quote.
              </p>
              <p className="mt-6 text-sm font-semibold text-[#1f2e8c]">Email: hello@sitebrew.co</p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="border-t border-[#1f2e8c]/10 bg-[#0e1a5c] py-8 text-center text-sm text-white/40">
        <p>© {new Date().getFullYear()} SiteBrew Company · Serving Georgia &amp; South Carolina · <Link href="/" className="hover:text-white transition">Back to Home</Link></p>
      </footer>
    </div>
  );
}
