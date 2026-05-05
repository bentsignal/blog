export interface Post {
  title: string;
  description: string;
  datePosted: Date;
  lastModified: Date;
  readingTimeInMinutes: number;
  tags: string[];
  hide?: true;
}

export const posts = {
  "start-faster": {
    title: "Start Faster",
    description: "The fastest shopping experience you've ever seen.",
    datePosted: new Date("2026-05-03"),
    lastModified: new Date("2026-05-03"),
    readingTimeInMinutes: 5,
    tags: ["E-commerce", "TanStack Start", "Convex", "Shopify"],
    hide: true,
  },
  "organize-react-projects": {
    title: "How should we organize our React projects?",
    description:
      "A deep dive into rethinking how we structure the code, files, and folders of our React projects",
    datePosted: new Date("2025-12-11"),
    lastModified: new Date("2026-05-03"),
    readingTimeInMinutes: 7,
    tags: ["React", "Atomic Design"],
  },
} as const satisfies Record<string, Post>;

export type Slug = keyof typeof posts;

export const slugs = Object.keys(posts)
  .filter((slug): slug is Slug => {
    if (Object.keys(posts).includes(slug)) return true;
    return false;
  })
  .filter((slug) => {
    const post = posts[slug];
    if ("hide" in post && process.env.NODE_ENV === "production") return false;
    return true;
  }) satisfies Slug[];
