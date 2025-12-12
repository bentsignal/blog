import type { PostSlug } from "@/blog/posts";
import type { ComponentType } from "react";
import OrganizingReactProjects from "@/blog/content/organizing-react-projects/page.mdx";

export const pages: Record<PostSlug, ComponentType> = {
  "organizing-react-projects": OrganizingReactProjects,
};
