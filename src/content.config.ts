import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    datePosted: z.coerce.date(),
    lastModified: z.coerce.date(),
    readingTimeInMinutes: z.number(),
    tags: z.array(z.string()),
    hide: z.boolean().optional(),
  }),
});

export const collections = { blog };
