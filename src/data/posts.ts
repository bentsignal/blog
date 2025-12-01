import type { Slug } from "@/data/slugs";

export interface Post {
  title: string;
  description: string;
  datePosted: Date;
  readingTimeInMinutes: number;
}

export const posts = {
  // "organizing-react-projects": {
  //   title: "How should we organize our React projects?",
  //   description:
  //     "A guide on thinking through how we should manage the code, filers, and folders in our React projects.",
  //   datePosted: new Date("2025-11-24"),
  //   readingTimeInMinutes: 1,
  // },
  "under-construction": {
    title: "Under Construction",
    description:
      "This post is still under construction. It will be updated soon.",
    datePosted: new Date("2025-12-01"),
    readingTimeInMinutes: 0,
  },
} as const satisfies Partial<Record<Slug, Post>>;

export const postSlugs = Object.keys(posts) as PostSlug[];

export type PostSlug = keyof typeof posts;
