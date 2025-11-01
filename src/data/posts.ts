import type { Slug } from "@/types/slugs";

export interface Post {
  title: string;
  subtitle: string;
}

export const posts = {
  "under-construction": {
    title: "Under Construction 🚧",
    subtitle: "Check back soon ! ! !",
  },
} as const satisfies Partial<Record<Slug, Post>>;

export const postSlugs = Object.keys(posts) as PostSlug[];

export type PostSlug = keyof typeof posts;
