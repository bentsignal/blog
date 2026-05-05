import Pages from "./content";
import { Slug } from "./posts";
import type { ComponentType } from "react";

export const pages = {
  "start-faster": Pages.StartFaster,
  "organize-react-projects": Pages.OrganizeReactProjects,
} as const satisfies Record<Slug, ComponentType>;
