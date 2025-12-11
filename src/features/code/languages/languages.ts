import * as Icons from "./icons";
import type { Language } from "./types";

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
