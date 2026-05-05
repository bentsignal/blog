import type { MetadataRoute } from "next";
import { posts, slugs } from "@/blog/posts";
import { siteUrl } from "@/urls";

export default function sitemap() {
  return slugs.map((slug) => {
    const post = posts[slug];
    return {
      url: `${siteUrl}/${slug}`,
      lastModified: post.lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    };
  }) satisfies MetadataRoute.Sitemap;
}
