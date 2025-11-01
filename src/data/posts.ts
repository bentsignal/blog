import type { Slug } from "@/types/slugs";

export interface Post {
  title: string;
  subtitle: string;
}

export const posts = {
  // "atomic-composition": {
  //   title: "Atomic Composition",
  //   subtitle: "A deep dive into atomic composition",
  // },
  // "build-strong-foundations": {
  //   title: "Build Strong Foundations",
  //   subtitle: "A deep dive into building strong foundations",
  // },
} as const satisfies Partial<Record<Slug, Post>>;

export const postSlugs = Object.keys(posts) as PostSlug[];

export type PostSlug = keyof typeof posts;
