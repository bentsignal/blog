import { Infer, v } from "convex/values";

export const vSlug = v.union(
  v.literal("general"),
  v.literal("under-construction"),
  v.literal("test"),
  v.literal("test2"),
  v.literal("test3"),
);

export type Slug = Infer<typeof vSlug>;
