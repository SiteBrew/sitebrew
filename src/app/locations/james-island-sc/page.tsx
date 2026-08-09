import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web Design & Local SEO in James Island, SC | SiteBrew",
  description:
    "SiteBrew builds custom websites and local SEO strategies for small businesses in James Island, SC. Part of our Georgia & South Carolina network — get found by local customers from day one.",
  alternates: { canonical: "https://sitebrew.co/locations/james-island-sc" },
  openGraph: {
    title: "Web Design & Local SEO in James Island, SC | SiteBrew",
    description:
      "SiteBrew builds custom websites and local SEO strategies for small businesses in James Island, SC. Part of our Georgia & South Carolina network — get found by local customers from day one.",
    type: "website",
    url: "https://sitebrew.co/locations/james-island-sc",
    siteName: "SiteBrew",
    locale: "en_US",
    images: [
      {
        url: "https://sitebrew.co/sitebrew-hero.webp",
        width: 1200,
        height: 630,
        alt: "SiteBrew — Web Design & Local SEO for James Island, SC",
      },
    ],
  },
};

export default function JamesIslandPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Web Design & Local SEO — James Island, SC",
    "provider": {
      "@type": "LocalBusiness",
      "@id": "https://sitebrew.co/#business",
      "name": "SiteBrew Company",
      "url": "https://sitebrew.co",
    },
    "areaServed": {
      "@type": "City",
      "name": "James Island",
      "addressRegion": "SC",
      "addressCountry": "US",
    },
    "description":
      "SiteBrew builds custom, mobile-first websites with built-in local SEO for small businesses in James Island, SC — helping them rank in neighborhood searches and turn local traffic into real customers.",
    "url": "https://sitebrew.co/locations/james-island-sc",
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
              James Island, SC
            </p>
            <h1 className="font-mono mt-4 text-4xl leading-tight text-[#1a130e] md:text-5xl">
              Web Design &amp; Local SEO<br className="hidden md:block" /> for James Island Businesses.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-[#4f4036]">
              James Island is a tight-knit community just minutes from downtown Charleston, and local businesses here thrive on neighborhood loyalty and word of mouth. But in 2025, word of mouth starts on Google — and if your website isn&apos;t showing up, you&apos;re missing out on customers who are already looking for exactly what you offer.
            </p>
            <p className="mt-4 max-w-2xl text-lg text-[#4f4036]">
              SiteBrew serves small businesses across Georgia and South Carolina, with deep roots in the Charleston area. We build custom websites for James Island businesses designed from the ground up to rank locally — on James Island, Folly Road, Harbor View Road, and the greater Lowcountry area. We combine clean, fast design with on-page SEO that speaks to your neighborhood customers, not a generic national audience.
            </p>
            <p className="mt-4 max-w-2xl text-lg text-[#4f4036]">
              Whether you run a local restaurant, a home services company, a fitness studio, or a retail shop, we&apos;ll build a website that reflects your brand and puts you in front of the right customers at the right moment. No fluff — just a site that works and a strategy that grows.
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

        {/* Why SiteBrew for James Island */}
        <section className="mx-auto w-full max-w-6xl px-6 py-16 md:px-10">
          <h2 className="font-mono text-3xl text-[#1a130e] md:text-4xl">Why James Island Businesses Choose SiteBrew</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: "🏡",
                title: "Community-Level Local SEO",
                body: "We optimize for James Island-specific search terms — not just &quot;Charleston&quot; — so you rank when neighbors search for your category.",
              },
              {
                icon: "🎨",
                title: "Professional Design, Real Results",
                body: "Your website reflects your business. We build designs that look sharp and credible while being engineered to convert visitors into customers.",
              },
              {
                icon: "🔧",
                title: "One Team, Full Service",
                body: "Design, development, SEO, Google Business Profile — we handle everything so you can focus on running your business, not chasing vendors.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-[#1f2e8c]/15 bg-white p-8 shadow-[0_14px_44px_-24px_rgba(31,46,140,0.2)]">
                <span className="text-3xl">{item.icon}</span>
                <h3 className="font-mono mt-4 text-xl font-semibold text-[#1a130e]">{item.title}</h3>
                <p className="mt-3 text-[#4f4036]" dangerouslySetInnerHTML={{ __html: item.body }} />
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section id="contact" className="mx-auto w-full max-w-6xl px-6 py-16 md:px-10">
          <div className="grid gap-6 rounded-[2rem] border border-[#1f2e8c]/20 bg-white/90 p-8 md:grid-cols-2 md:p-10">
            <div>
              <h2 className="font-mono text-3xl text-[#1a130e] md:text-4xl">
                Ready to grow your James Island business?
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
