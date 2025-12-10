import type { Slug } from "@/data/slugs";

export interface Post {
  title: string;
  description: string;
  datePosted: Date;
  readingTimeInMinutes: number;
}

export const posts = {
  "organizing-react-projects": {
    title: "How should we organize our React projects?",
    description:
      "A deep dive into reevaluating how we manage the code, files, and folders in our React projects.",
    datePosted: new Date("2025-12-11"),
    readingTimeInMinutes: 10,
  },
} as const satisfies Partial<Record<Slug, Post>>;

export const postSlugs = Object.keys(posts) as PostSlug[];

export type PostSlug = keyof typeof posts;
