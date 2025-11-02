import type { Slug } from "@/data/slugs";

export interface Post {
  title: string;
  subtitle: string;
  datePosted: Date;
  readingTimeInMinutes: number;
}

export const posts = {
  "under-construction": {
    title: "Under Construction 🚧",
    subtitle: "Check back soon ! ! !",
    datePosted: new Date("2025-11-02"),
    readingTimeInMinutes: 1,
  },
} as const satisfies Partial<Record<Slug, Post>>;

export const postSlugs = Object.keys(posts) as PostSlug[];

export type PostSlug = keyof typeof posts;
