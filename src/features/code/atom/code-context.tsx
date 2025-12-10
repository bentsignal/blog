"use client";

import { ReactNode, useState } from "react";
import type { Language } from "@/features/code/languages";
import { createContext } from "@/lib/context";

export const { Context: CodeContext, useContext: useCode } = createContext<{
  code: string;
  language: Language;
  showLineNumbers: boolean;
  toggleLineNumbers: () => void;
  wrapLines: boolean;
  toggleLineWrapping: () => void;
}>({ displayName: "CodeContext" });

export function Provider({
  code,
  language,
  children,
}: {
  code: string;
  language: Language;
  children: ReactNode;
}) {
  const [showLineNumbers, setShowLineNumbers] = useState(false);
  const [wrapLines, setWrapLines] = useState(true);

  const toggleLineNumbers = () => setShowLineNumbers((prev) => !prev);
  const toggleLineWrapping = () => setWrapLines((prev) => !prev);

  const contextValue = {
    code,
    language,
    showLineNumbers,
    toggleLineNumbers,
    wrapLines,
    toggleLineWrapping,
  };

  if (!children) return null;

  return (
    <CodeContext.Provider value={contextValue}>{children}</CodeContext.Provider>
  );
}
