"use client";

import { useState } from "react";
import { createStore } from "rostra";
import type { Language } from "@/features/code/languages/types";

type StoreProps = {
  code: string;
  language: Language;
};

function useInternalStore({ code, language }: StoreProps) {
  const [showLineNumbers, setShowLineNumbers] = useState(false);
  const [wrapLines, setWrapLines] = useState(true);

  const toggleLineNumbers = () => setShowLineNumbers((prev) => !prev);
  const toggleLineWrapping = () => setWrapLines((prev) => !prev);

  return {
    code,
    language,
    showLineNumbers,
    toggleLineNumbers,
    wrapLines,
    toggleLineWrapping,
  };
}

export const { Store, useStore } = createStore(useInternalStore);
