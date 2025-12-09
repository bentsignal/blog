import * as Icons from "./language-icons";
import { type Language } from "./language-types";

export const languages = {
  react: {
    label: "React",
    id: "tsx",
    icon: Icons.React,
  },
  typescript: {
    label: "TypeScript",
    id: "typescript",
    icon: Icons.TypeScript,
  },
} as const satisfies Record<string, Language>;
