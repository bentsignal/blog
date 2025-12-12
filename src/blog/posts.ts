import type { Slug } from "@/blog/slugs";

export interface Post {
  title: string;
  description: string;
  datePosted: Date;
  lastModified: Date;
  readingTimeInMinutes: number;
  tags?: string[];
}

export const posts = {
  "organizing-react-projects": {
    title: "How should we organize our React projects?",
    description:
      "A deep dive into rethinking how we structure the code, files, and folders of our React projects",
    datePosted: new Date("2025-12-11"),
    lastModified: new Date("2025-12-13"),
    readingTimeInMinutes: 7,
    tags: ["React", "Atomic Design"],
  },
} as const satisfies Partial<Record<Slug, Post>>;

export const postSlugs = Object.keys(posts) as PostSlug[];

export type PostSlug = keyof typeof posts;
