import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts, getPost } from "@/lib/blog";
import type { Metadata } from "next";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const url = `https://sitebrew.co/blog/${slug}`;
  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author, url: "https://sitebrew.co" }],
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url,
      siteName: "SiteBrew",
      locale: "en_US",
      publishedTime: new Date(post.date).toISOString(),
      authors: [post.author],
      section: post.category,
      images: [
        {
          url: "https://sitebrew.co/sitebrew-hero.webp",
          width: 1200,
          height: 630,
          alt: `${post.title} — SiteBrew Blog`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: ["https://sitebrew.co/sitebrew-hero.webp"],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const otherPosts = posts.filter((p) => p.slug !== slug).slice(0, 2);

  // Render markdown-ish content (headings, paragraphs, lists, bold, links)
  function renderContent(raw: string) {
    return raw.split("\n\n").map((block, i) => {
      if (block.startsWith("## ")) {
        return <h2 key={i} className="font-mono text-2xl font-semibold text-[#1a130e] mt-10 mb-3">{block.slice(3)}</h2>;
      }
      if (block.startsWith("### ")) {
        return <h3 key={i} className="font-mono text-xl font-semibold text-[#1f2e8c] mt-8 mb-2">{block.slice(4)}</h3>;
      }
      if (block.startsWith("---")) {
        return <hr key={i} className="my-10 border-[#1f2e8c]/10" />;
      }
      if (block.startsWith("- ") || block.startsWith("**")) {
        const lines = block.split("\n");
        // Check if it's a list
        if (lines.every(l => l.startsWith("- "))) {
          return (
            <ul key={i} className="my-4 space-y-2 pl-5">
              {lines.map((l, j) => (
                <li key={j} className="flex items-start gap-2 text-[#4f4036]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1f2e8c]" />
                  <span dangerouslySetInnerHTML={{ __html: formatInline(l.slice(2)) }} />
                </li>
              ))}
            </ul>
          );
        }
      }
      // Numbered list
      if (/^\d+\./.test(block)) {
        const lines = block.split("\n").filter(Boolean);
        return (
          <ol key={i} className="my-4 space-y-2 pl-5 list-decimal">
            {lines.map((l, j) => (
              <li key={j} className="text-[#4f4036] pl-1">
                <span dangerouslySetInnerHTML={{ __html: formatInline(l.replace(/^\d+\.\s*/, "")) }} />
              </li>
            ))}
          </ol>
        );
      }
      // Italic block quote style
      if (block.startsWith("*") && block.endsWith("*")) {
        return <p key={i} className="my-4 border-l-4 border-[#1f2e8c]/30 pl-4 italic text-[#4f4036]" dangerouslySetInnerHTML={{ __html: formatInline(block.slice(1, -1)) }} />;
      }
      return <p key={i} className="my-4 text-[#4f4036] leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInline(block) }} />;
    });
  }

  function formatInline(text: string) {
    return text
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#1f2e8c] font-semibold hover:underline">$1</a>');
  }

  const postUrl = `https://sitebrew.co/blog/${slug}`;
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "url": postUrl,
    "datePublished": new Date(post.date).toISOString(),
    "dateModified": new Date(post.date).toISOString(),
    "author": {
      "@type": "Person",
      "name": post.author,
      "url": "https://sitebrew.co",
      "worksFor": {"@type": "Organization", "name": "SiteBrew Company", "url": "https://sitebrew.co"}
    },
    "publisher": {
      "@type": "Organization",
      "@id": "https://sitebrew.co/#business",
      "name": "SiteBrew Company",
      "logo": {"@type": "ImageObject", "url": "https://sitebrew.co/sitebrew-logo-nav.png"}
    },
    "mainEntityOfPage": {"@type": "WebPage", "@id": postUrl},
    "image": "https://sitebrew.co/sitebrew-hero.webp",
    "articleSection": post.category,
    "keywords": `${post.category}, web design Georgia South Carolina, local SEO, SiteBrew`,
    "inLanguage": "en-US",
    "isPartOf": {"@type": "Blog", "name": "SiteBrew Blog", "url": "https://sitebrew.co/blog"}
  };

  return (
    <div className="sitebrew-page min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }} />
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
        {/* Post Hero */}
        <section className="bg-gradient-to-br from-[#eef1fc] via-[#f5f1e8] to-[#fdf3e3] py-16 md:py-20">
          <div className="mx-auto w-full max-w-3xl px-6 md:px-10">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1f2e8c] hover:underline mb-6">
              ← Back to Blog
            </Link>
            <div className="flex items-center gap-2 mb-4">
              <span className="rounded-full bg-[#1f2e8c]/10 px-3 py-1 text-xs font-semibold text-[#1f2e8c]">{post.category}</span>
              <span className="text-xs text-[#4f4036]/60">{post.readTime}</span>
            </div>
            <h1 className="font-mono text-3xl leading-tight text-[#1a130e] md:text-5xl">{post.title}</h1>
            <p className="mt-4 text-lg text-[#4f4036]">{post.description}</p>
            <div className="mt-6 flex items-center gap-3 border-t border-[#1f2e8c]/10 pt-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1f2e8c]/10 font-mono text-sm font-bold text-[#1f2e8c]">
                {post.author.split(" ").map(w => w[0]).join("")}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a130e]">{post.author}</p>
                <p className="text-xs text-[#4f4036]/60">{post.authorRole} · {post.date}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Post Body */}
        <article className="mx-auto w-full max-w-3xl px-6 py-12 md:px-10">
          {renderContent(post.content)}
        </article>

        {/* Author Bio */}
        <section className="mx-auto w-full max-w-3xl px-6 pb-10 md:px-10">
          {post.author === "Carter Wilson" ? (
            <div className="flex items-start gap-5 rounded-2xl border border-[#1f2e8c]/15 bg-[#eef1fc]/60 p-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#1f2e8c] font-mono text-lg font-bold text-white">
                CW
              </div>
              <div>
                <p className="font-semibold text-[#1a130e]">Carter Wilson</p>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#1f2e8c]/60 mt-0.5">Founder · Web Development</p>
                <p className="mt-3 text-sm text-[#4f4036] leading-relaxed">
                  Carter is the founder and lead developer at SiteBrew. He specializes in building fast, mobile-first websites that are engineered to rank from day one — clean code, sharp design, and no bloat. When he&apos;s not building sites for Georgia and South Carolina businesses, he&apos;s obsessing over Core Web Vitals and load times.
                </p>
                <a href="mailto:carter@sitebrew.co" className="mt-3 inline-block text-sm font-semibold text-[#1f2e8c] hover:underline">
                  carter@sitebrew.co
                </a>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-5 rounded-2xl border border-[#1f2e8c]/15 bg-[#eef1fc]/60 p-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#1f2e8c] font-mono text-lg font-bold text-white">
                DB
              </div>
              <div>
                <p className="font-semibold text-[#1a130e]">David Bouse</p>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#1f2e8c]/60 mt-0.5">Co-Founder · SEO & Growth</p>
                <p className="mt-3 text-sm text-[#4f4036] leading-relaxed">
                  David is the co-founder and SEO strategist at SiteBrew. His background in search engine optimization and online marketing is what sparked the company — he&apos;s the reason SiteBrew clients don&apos;t just get beautiful websites, they get websites that actually rank. He lives and breathes local search strategy for Georgia and South Carolina businesses.
                </p>
                <a href="mailto:david@sitebrew.co" className="mt-3 inline-block text-sm font-semibold text-[#1f2e8c] hover:underline">
                  david@sitebrew.co
                </a>
              </div>
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="mx-auto w-full max-w-3xl px-6 pb-10 md:px-10">
          <div className="rounded-[2rem] bg-gradient-to-br from-[#1f2e8c] to-[#2d45c4] p-8 text-center">
            <h2 className="font-mono text-xl text-white md:text-2xl">Want help with your Georgia or South Carolina business website?</h2>
            <p className="mt-2 text-white/70">We handle the design, SEO, and everything in between.</p>
            <Link href="/#contact" className="mt-5 inline-block rounded-full bg-white px-7 py-3 font-semibold text-[#1f2e8c] transition hover:bg-[#eef1fc]">
              Get a Free Audit
            </Link>
          </div>
        </section>

        {/* More Posts */}
        {otherPosts.length > 0 && (
          <section className="mx-auto w-full max-w-3xl px-6 pb-20 md:px-10">
            <h2 className="font-mono text-2xl text-[#1a130e] mb-6">More from the Blog</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {otherPosts.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="group rounded-2xl border border-[#1f2e8c]/20 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <span className="text-xs font-semibold text-[#1f2e8c]">{p.category}</span>
                  <h3 className="mt-2 font-mono text-lg font-semibold text-[#1a130e] group-hover:text-[#1f2e8c] transition leading-snug">{p.title}</h3>
                  <p className="mt-2 text-sm text-[#4f4036]">{p.date} · {p.readTime}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1f2e8c]/10 bg-[#0e1a5c] py-8 text-center text-sm text-white/40">
        <p>© {new Date().getFullYear()} SiteBrew Company · Serving Georgia &amp; South Carolina · <Link href="/" className="hover:text-white transition">Back to Home</Link></p>
      </footer>
    </div>
  );
}
