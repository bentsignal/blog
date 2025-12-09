import { type Language } from "./language-types";
import { languages } from "./languages";

const getLanguage = (language: string): Language => {
  const lang = language.toLowerCase().trim();
  if (["ts", "typescript"].includes(lang)) return languages.typescript;
  if (["jsx", "tsx", "react"].includes(lang)) return languages.react;
  throw new Error(`Unknown language: ${language}`);
};

export { getLanguage };
