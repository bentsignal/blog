"use client";

import { ReactNode, useState } from "react";
import { type Language } from "@/features/code/languages";
import { createContext } from "@/lib/context";

const { Context, use } = createContext<{
  code: string;
  language: Language;
  showLineNumbers: boolean;
  toggleLineNumbers: () => void;
  wrapLines: boolean;
  toggleLineWrapping: () => void;
}>({ displayName: "CodeContext" });

const Provider = ({
  code,
  language,
  children,
}: {
  code: string;
  language: Language;
  children: ReactNode;
}) => {
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

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export { Provider, Context, use };
