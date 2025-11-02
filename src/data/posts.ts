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
  test: {
    title: "Test",
    subtitle: "Test",
  },
  test2: {
    title: "Test 2",
    subtitle: "Test 2",
  },
  test3: {
    title: "Test 3",
    subtitle: "Test 3",
  },
} as const satisfies Partial<Record<Slug, Post>>;

export const postSlugs = Object.keys(posts) as PostSlug[];

export type PostSlug = keyof typeof posts;
