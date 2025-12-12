import type { PostSlug } from "@/blog/posts";
import type { ComponentType } from "react";
import OrganizeReactProjects from "@/blog/content/organize-react-projects/page.mdx";

export const pages: Record<PostSlug, ComponentType> = {
  "organize-react-projects": OrganizeReactProjects,
};
