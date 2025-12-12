import type { MetadataRoute } from "next";
import { posts } from "@/blog/posts";
import { env } from "@/env";

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.entries(posts).map(([slug, post]) => {
    return {
      url: `${env.NEXT_PUBLIC_SITE_URL}/${slug}`,
      lastModified: post.datePosted,
      changeFrequency: "monthly",
      priority: 0.5,
    };
  });
}
