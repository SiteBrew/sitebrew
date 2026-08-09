import Image from "next/image";
import Link from "next/link";
import { posts } from "@/lib/blog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Web Design & Local SEO Tips for Georgia & South Carolina Businesses",
  description:
    "Practical guides on local SEO, web design, and growing your small business online across Georgia and South Carolina. Written by the SiteBrew team.",
  alternates: {
    canonical: "https://sitebrew.co/blog",
  },
  openGraph: {
    title: "Blog — Web Design & Local SEO Tips for Georgia & South Carolina Businesses",
    description: "Practical guides on local SEO, web design, and growing your small business online across Georgia and South Carolina.",
    type: "website",
    url: "https://sitebrew.co/blog",
    siteName: "SiteBrew",
    locale: "en_US",
    images: [
      {
        url: "https://sitebrew.co/sitebrew-hero.webp",
        width: 1200,
        height: 630,
        alt: "SiteBrew Blog — Web Design & Local SEO Tips",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Web Design & Local SEO Tips for Georgia & South Carolina Businesses",
    description: "Practical guides on local SEO, web design, and growing your small business online across Georgia and South Carolina.",
    images: ["https://sitebrew.co/sitebrew-hero.webp"],
  },
};

export default function BlogPage() {
  return (
    <div className="sitebrew-page min-h-screen">
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
            <Link href="/blog" className="text-[#1f2e8c] font-semibold">Blog</Link>
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
              The SiteBrew Blog
            </p>
            <h1 className="font-mono mt-4 text-4xl leading-tight text-[#1a130e] md:text-5xl">
              Web design &amp; local SEO tips for<br className="hidden md:block" /> Georgia &amp; South Carolina businesses.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-[#4f4036]">
              Practical guides to help small businesses across Georgia and South Carolina get found online, convert more visitors, and grow.
            </p>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="mx-auto w-full max-w-6xl px-6 py-16 md:px-10">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col overflow-hidden rounded-3xl border border-[#1f2e8c]/20 bg-white shadow-[0_14px_44px_-24px_rgba(31,46,140,0.35)] transition hover:shadow-[0_20px_60px_-20px_rgba(31,46,140,0.5)] hover:-translate-y-1">
                {/* Card top colour bar */}
                <div className="h-2 w-full bg-gradient-to-r from-[#1f2e8c] to-[#4f6aff]" />
                <div className="flex flex-col flex-1 p-7">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#1f2e8c]/10 px-3 py-1 text-xs font-semibold text-[#1f2e8c]">
                      {post.category}
                    </span>
                    <span className="text-xs text-[#4f4036]/60">{post.readTime}</span>
                  </div>
                  <h2 className="mt-3 font-mono text-xl font-semibold leading-snug text-[#1a130e] group-hover:text-[#1f2e8c] transition">
                    {post.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm text-[#4f4036]">{post.description}</p>
                  <div className="mt-6 flex items-center justify-between border-t border-[#1f2e8c]/10 pt-4">
                    <div>
                      <p className="text-xs font-semibold text-[#1a130e]">{post.author}</p>
                      <p className="text-xs text-[#4f4036]/60">{post.date}</p>
                    </div>
                    <span className="text-sm font-semibold text-[#1f2e8c] group-hover:underline">Read →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto w-full max-w-6xl px-6 pb-20 md:px-10">
          <div className="rounded-[2rem] bg-gradient-to-br from-[#1f2e8c] to-[#2d45c4] p-10 text-center">
            <h2 className="font-mono text-2xl text-white md:text-3xl">Ready to grow your Georgia or South Carolina business?</h2>
            <p className="mt-3 text-white/70 max-w-md mx-auto">We build websites that rank. Get a free audit and custom quote.</p>
            <Link href="/#contact" className="mt-6 inline-block rounded-full bg-white px-8 py-3 font-semibold text-[#1f2e8c] transition hover:bg-[#eef1fc]">
              Get a Free Audit
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1f2e8c]/10 bg-[#0e1a5c] py-8 text-center text-sm text-white/40">
        <p>© {new Date().getFullYear()} SiteBrew Company · Serving Georgia &amp; South Carolina · <Link href="/" className="hover:text-white transition">Back to Home</Link></p>
      </footer>
    </div>
  );
}
