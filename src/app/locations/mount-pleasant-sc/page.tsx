import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web Design & Local SEO in Mount Pleasant, SC | SiteBrew",
  description:
    "SiteBrew builds custom websites and local SEO strategies for small businesses in Mount Pleasant, SC. Part of our Georgia & South Carolina network — get found on Google from day one.",
  alternates: { canonical: "https://sitebrew.co/locations/mount-pleasant-sc" },
  openGraph: {
    title: "Web Design & Local SEO in Mount Pleasant, SC | SiteBrew",
    description:
      "SiteBrew builds custom websites and local SEO strategies for small businesses in Mount Pleasant, SC. Part of our Georgia & South Carolina network — get found on Google from day one.",
    type: "website",
    url: "https://sitebrew.co/locations/mount-pleasant-sc",
    siteName: "SiteBrew",
    locale: "en_US",
    images: [
      {
        url: "https://sitebrew.co/sitebrew-hero.webp",
        width: 1200,
        height: 630,
        alt: "SiteBrew — Web Design & Local SEO for Mount Pleasant, SC",
      },
    ],
  },
};

export default function MountPleasantPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Web Design & Local SEO — Mount Pleasant, SC",
    "provider": {
      "@type": "LocalBusiness",
      "@id": "https://sitebrew.co/#business",
      "name": "SiteBrew Company",
      "url": "https://sitebrew.co",
    },
    "areaServed": {
      "@type": "City",
      "name": "Mount Pleasant",
      "addressRegion": "SC",
      "addressCountry": "US",
    },
    "description":
      "SiteBrew builds custom, mobile-first websites with built-in local SEO for small businesses in Mount Pleasant, SC — helping them rank on Google and convert more visitors into customers.",
    "url": "https://sitebrew.co/locations/mount-pleasant-sc",
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
              Mount Pleasant, SC
            </p>
            <h1 className="font-mono mt-4 text-4xl leading-tight text-[#1a130e] md:text-5xl">
              Web Design &amp; Local SEO<br className="hidden md:block" /> for Mount Pleasant Businesses.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-[#4f4036]">
              Mount Pleasant is one of the fastest-growing communities in South Carolina — and one of the most competitive markets for local businesses. If your website isn&apos;t built to rank on Google, you&apos;re handing customers to your competitors every single day.
            </p>
            <p className="mt-4 max-w-2xl text-lg text-[#4f4036]">
              SiteBrew serves small businesses across Georgia and South Carolina, and Mount Pleasant is one of our core South Carolina markets. From Shem Creek restaurants to Coleman Boulevard service companies, we build fast, mobile-first websites with on-page SEO baked in from the start. We know the local market, the search terms your customers are using, and exactly how to position your business to win.
            </p>
            <p className="mt-4 max-w-2xl text-lg text-[#4f4036]">
              Every site we build includes a fully optimized Google Business Profile, local citation setup, and a design that turns visitors into calls and contact form submissions. Whether you need a brand-new site or want to rescue an underperforming one, we&apos;ll give you an honest audit and a clear path forward.
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

        {/* Why SiteBrew for Mount Pleasant */}
        <section className="mx-auto w-full max-w-6xl px-6 py-16 md:px-10">
          <h2 className="font-mono text-3xl text-[#1a130e] md:text-4xl">Why Mount Pleasant Businesses Choose SiteBrew</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: "📍",
                title: "We Know the Local Market",
                body: "We understand Mount Pleasant neighborhoods, search patterns, and the competitive landscape — so we build strategies that actually work here.",
              },
              {
                icon: "⚡",
                title: "Fast, Mobile-First Websites",
                body: "Over 60% of local searches happen on mobile. Every site we build is optimized for speed and performance on every device.",
              },
              {
                icon: "📈",
                title: "SEO Built In From Day One",
                body: "No bolt-on plugins or afterthought. Local SEO is woven into the architecture, copy, and structure of every page we create.",
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
                Ready to grow your Mount Pleasant business?
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
