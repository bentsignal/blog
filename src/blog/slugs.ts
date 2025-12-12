import { Infer, v } from "convex/values";

export const vSlug = v.union(
  v.literal("general"),
  v.literal("organizing-react-projects"),
  v.literal("organize-react-projects"),
);

export type Slug = Infer<typeof vSlug>;
