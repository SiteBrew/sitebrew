import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { VisualEditsMessenger } from "orchids-visual-edits";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import { Toaster } from "sonner";

const geistSans = Space_Grotesk({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Space_Mono({
  variable: "--font-geist-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});


export const metadata: Metadata = {
  metadataBase: new URL("https://sitebrew.co"),
  title: {
    default: "Web Design & Local SEO Services | SiteBrew — Georgia & South Carolina",
    template: "%s | SiteBrew",
  },
  description:
    "SiteBrew builds custom websites and local SEO strategies for small businesses across Georgia and South Carolina. Get found on Google from day one.",
  keywords: [
    "web design Georgia",
    "web design South Carolina",
    "local SEO Georgia",
    "local SEO South Carolina",
    "small business website design Atlanta",
    "small business website design Charleston SC",
    "Atlanta web design",
    "Savannah web design",
    "Augusta SEO",
    "Charleston SC web design",
    "Columbia SC website",
    "Greenville SC web design",
    "Myrtle Beach SEO",
    "Hilton Head web design",
    "Georgia local SEO agency",
    "South Carolina local SEO agency",
    "SiteBrew",
  ],
  authors: [
    { name: "Carter Wilson", url: "https://sitebrew.co" },
    { name: "David Bouse", url: "https://sitebrew.co" },
  ],
  creator: "SiteBrew Company",
  publisher: "SiteBrew Company",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 },
  },
  alternates: {
    canonical: "https://sitebrew.co",
  },
  openGraph: {
    title: "Web Design & Local SEO Services | SiteBrew — Georgia & South Carolina",
    description: "Custom websites with built-in SEO for small businesses across Georgia and South Carolina. Get found on Google from day one.",
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
    creator: "@sitebrewco",
    title: "Web Design & Local SEO Services | SiteBrew — Georgia & South Carolina",
    description: "Custom websites with built-in SEO for small businesses across Georgia and South Carolina. Get found on Google from day one.",
    images: ["https://sitebrew.co/sitebrew-hero.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "@id": "https://sitebrew.co/#website",
                "url": "https://sitebrew.co",
                "name": "SiteBrew",
                "description": "Web Design & Local SEO for Small Businesses across Georgia and South Carolina",
                "publisher": {"@id": "https://sitebrew.co/#business"},
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": {"@type": "EntryPoint", "urlTemplate": "https://sitebrew.co/blog?q={search_term_string}"},
                  "query-input": "required name=search_term_string"
                },
                "inLanguage": "en-US"
              },
              {
                "@type": ["LocalBusiness", "ProfessionalService"],
                "@id": "https://sitebrew.co/#business",
                "name": "SiteBrew Company",
                "url": "https://sitebrew.co",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://sitebrew.co/sitebrew-logo-nav.png",
                  "width": 200,
                  "height": 200
                },
                "image": "https://sitebrew.co/sitebrew-hero.webp",
                "description": "SiteBrew builds custom websites with built-in SEO for small businesses across Georgia and South Carolina — serving Atlanta, Savannah, Augusta, Charleston, Columbia, Greenville, Myrtle Beach, and beyond.",
                "email": "hello@sitebrew.co",
                "telephone": ["+17703121971", "+16787617848"],
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Charleston",
                  "addressRegion": "SC",
                  "addressCountry": "US"
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": 32.7765,
                  "longitude": -79.9311
                },
                "areaServed": [
                  {"@type": "State", "name": "Georgia", "addressCountry": "US"},
                  {"@type": "State", "name": "South Carolina", "addressCountry": "US"},
                  {"@type": "City", "name": "Atlanta", "addressRegion": "GA"},
                  {"@type": "City", "name": "Savannah", "addressRegion": "GA"},
                  {"@type": "City", "name": "Augusta", "addressRegion": "GA"},
                  {"@type": "City", "name": "Columbus", "addressRegion": "GA"},
                  {"@type": "City", "name": "Macon", "addressRegion": "GA"},
                  {"@type": "City", "name": "Athens", "addressRegion": "GA"},
                  {"@type": "City", "name": "Roswell", "addressRegion": "GA"},
                  {"@type": "City", "name": "Alpharetta", "addressRegion": "GA"},
                  {"@type": "City", "name": "Marietta", "addressRegion": "GA"},
                  {"@type": "City", "name": "Gainesville", "addressRegion": "GA"},
                  {"@type": "City", "name": "Charleston", "addressRegion": "SC"},
                  {"@type": "City", "name": "Columbia", "addressRegion": "SC"},
                  {"@type": "City", "name": "Greenville", "addressRegion": "SC"},
                  {"@type": "City", "name": "Mount Pleasant", "addressRegion": "SC"},
                  {"@type": "City", "name": "North Charleston", "addressRegion": "SC"},
                  {"@type": "City", "name": "Summerville", "addressRegion": "SC"},
                  {"@type": "City", "name": "Myrtle Beach", "addressRegion": "SC"},
                  {"@type": "City", "name": "Hilton Head", "addressRegion": "SC"},
                  {"@type": "City", "name": "Spartanburg", "addressRegion": "SC"},
                  {"@type": "City", "name": "James Island", "addressRegion": "SC"}
                ],
                "hasOfferCatalog": {
                  "@type": "OfferCatalog",
                  "name": "Web Design & SEO Services",
                  "itemListElement": [
                    {
                      "@type": "Offer",
                      "itemOffered": {
                        "@type": "Service",
                        "name": "Starter Site — Custom Web Design",
                        "description": "Mobile-first custom website design with on-page SEO, Google Business Profile setup, and contact forms for local businesses.",
                        "provider": {"@id": "https://sitebrew.co/#business"}
                      },
                      "price": "999",
                      "priceCurrency": "USD",
                      "priceSpecification": {"@type": "UnitPriceSpecification", "priceType": "https://schema.org/OneTimePurchase"}
                    },
                    {
                      "@type": "Offer",
                      "itemOffered": {
                        "@type": "Service",
                        "name": "Growth Plan — Monthly SEO & Maintenance",
                        "description": "Monthly SEO updates, performance monitoring, Google ranking reports, and ongoing website maintenance to keep local businesses climbing search results.",
                        "provider": {"@id": "https://sitebrew.co/#business"}
                      },
                      "price": "125",
                      "priceCurrency": "USD",
                      "priceSpecification": {"@type": "UnitPriceSpecification", "priceType": "https://schema.org/RecurringCharge", "billingIncrement": 1, "unitCode": "MON"}
                    }
                  ]
                },
                "priceRange": "$$",
                "knowsAbout": ["Web Design", "Local SEO", "Search Engine Optimization", "Google Business Profile", "Mobile-First Development", "Website Maintenance"],
                "sameAs": ["https://www.linkedin.com/company/sitebrewco"]
              },
              {
                "@type": "Person",
                "@id": "https://sitebrew.co/#carter-wilson",
                "name": "Carter Wilson",
                "jobTitle": "Founder, Web Developer",
                "email": "carter@sitebrew.co",
                "telephone": "+17703121971",
                "url": "https://sitebrew.co",
                "sameAs": ["https://www.linkedin.com/company/sitebrewco"],
                "worksFor": {"@id": "https://sitebrew.co/#business"},
                "knowsAbout": ["Web Design", "Mobile-First Development", "Front-End Engineering", "Website Performance", "Local Business Websites"],
                "description": "Carter Wilson is the founder and lead web developer at SiteBrew. He builds fast, mobile-first websites for small businesses across Georgia and South Carolina."
              },
              {
                "@type": "Person",
                "@id": "https://sitebrew.co/#david-bouse",
                "name": "David Bouse",
                "jobTitle": "Co-Founder, SEO & Growth Strategist",
                "email": "david@sitebrew.co",
                "telephone": "+16787617848",
                "url": "https://sitebrew.co",
                "sameAs": ["https://www.linkedin.com/company/sitebrewco"],
                "worksFor": {"@id": "https://sitebrew.co/#business"},
                "knowsAbout": ["Local SEO", "Search Engine Optimization", "Google Business Profile", "Content Strategy", "Online Marketing", "Georgia Local Search", "South Carolina Local Search"],
                "description": "David Bouse is the co-founder and SEO strategist at SiteBrew. He crafts the local search strategies that get small businesses across Georgia and South Carolina found on Google and keep them climbing the rankings."
              },
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "How long does it take to launch my website?",
                    "acceptedAnswer": {"@type": "Answer", "text": "Most websites are designed, built, and launched within 2–3 weeks after our initial discovery call. We follow a streamlined process: discovery, design, build, review, and launch."}
                  },
                  {
                    "@type": "Question",
                    "name": "What happens if I'm not happy with the design?",
                    "acceptedAnswer": {"@type": "Answer", "text": "We don't launch anything you don't love. Every package includes a round of revisions so you can provide feedback and we'll refine until it's right. If you're still not satisfied, you only pay for work completed up to that point."}
                  },
                  {
                    "@type": "Question",
                    "name": "Who owns the website after it's built?",
                    "acceptedAnswer": {"@type": "Answer", "text": "You own everything you paid for — design, code, and content — 100%. No licensing fees or lock-in contracts. Starter Site clients own the site outright. Growth Plan clients own their assets but we host and maintain the site on our infrastructure while on the monthly plan, so you get ongoing updates, security, and performance monitoring."}
                  },
                  {
                    "@type": "Question",
                    "name": "What's included in ongoing support?",
                    "acceptedAnswer": {"@type": "Answer", "text": "Growth Plan clients receive monthly content updates, SEO improvements, speed monitoring, ranking reports, security patches, backups, and priority support. Starter Site clients can request paid edits as needed after launch."}
                  },
                  {
                    "@type": "Question",
                    "name": "How much does a website cost?",
                    "acceptedAnswer": {"@type": "Answer", "text": "Our Starter Site is a one-time fee of $999 — a polished, professional website that ranks from day one. Our Growth Plan is $800 upfront plus $125/month for ongoing SEO updates, performance monitoring, and priority support."}
                  },
                  {
                    "@type": "Question",
                    "name": "What areas do you serve?",
                    "acceptedAnswer": {"@type": "Answer", "text": "We serve small businesses across Georgia and South Carolina — Atlanta, Savannah, Augusta, Columbus, Macon, Athens, Roswell, Alpharetta, Marietta, Gainesville in Georgia, and Charleston, Columbia, Greenville, Mount Pleasant, North Charleston, Summerville, Myrtle Beach, Hilton Head, Spartanburg in South Carolina."}
                  }
                ]
              },
              {
                "@type": "Service",
                "@id": "https://sitebrew.co/#web-design-service",
                "name": "Custom Web Design for Small Businesses",
                "description": "Mobile-first, SEO-optimized custom website design for small businesses across Georgia and South Carolina. Includes on-page SEO, Google Business Profile setup, fast hosting, and contact forms.",
                "provider": {"@id": "https://sitebrew.co/#business"},
                "areaServed": [
                  {"@type": "State", "name": "Georgia", "addressCountry": "US"},
                  {"@type": "State", "name": "South Carolina", "addressCountry": "US"}
                ],
                "serviceType": "Web Design",
                "offers": {
                  "@type": "Offer",
                  "price": "999",
                  "priceCurrency": "USD",
                  "priceSpecification": {"@type": "UnitPriceSpecification", "priceType": "https://schema.org/OneTimePurchase"}
                }
              },
              {
                "@type": "Service",
                "@id": "https://sitebrew.co/#local-seo-service",
                "name": "Local SEO Services",
                "description": "Monthly local SEO optimization including Google Business Profile management, local keyword targeting, ranking reports, and content updates to help small businesses rank higher in local search results across Georgia and South Carolina.",
                "provider": {"@id": "https://sitebrew.co/#business"},
                "areaServed": [
                  {"@type": "State", "name": "Georgia", "addressCountry": "US"},
                  {"@type": "State", "name": "South Carolina", "addressCountry": "US"}
                ],
                "serviceType": "Local SEO",
                "offers": {
                  "@type": "Offer",
                  "price": "125",
                  "priceCurrency": "USD",
                  "priceSpecification": {"@type": "UnitPriceSpecification", "priceType": "https://schema.org/RecurringCharge", "billingIncrement": 1, "unitCode": "MON"}
                }
              }
            ]
          })}}
        />
        {children}
        <Toaster position="bottom-right" richColors closeButton />
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
