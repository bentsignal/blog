import { Infer, v } from "convex/values";

export const vSlug = v.union(
  v.literal("general"),
  v.literal("atomic-composition"),
  v.literal("build-strong-foundations"),
);

export type Slug = Infer<typeof vSlug>;
