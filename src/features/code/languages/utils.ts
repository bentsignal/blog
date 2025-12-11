import { languages } from "./languages";
import type { Language } from "./types";

const getLanguage = (language: string): Language => {
  const lang = language.toLowerCase().trim();
  if (["ts", "typescript"].includes(lang)) return languages.typescript;
  if (["jsx", "tsx", "react"].includes(lang)) return languages.react;
  throw new Error(`Unknown language: ${language}`);
};

export { getLanguage };
