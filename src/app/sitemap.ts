import { MetadataRoute } from "next";
import { posts } from "@/lib/blog";

const locationPages = [
  "mount-pleasant-sc",
  "north-charleston-sc",
  "james-island-sc",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://sitebrew.co";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    ...locationPages.map((slug) => ({
      url: `${base}/locations/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
