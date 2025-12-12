"use client";

import { FramedCodeBlock } from "./framed-code-block";
import { InlineCode } from "./inline-code";
import { getLanguage } from "@/features/code/languages/utils";

const CodeSnippet = ({
  children,
  className,
  isInline,
}: {
  children: React.ReactNode;
  className?: string;
  isInline?: boolean;
}) => {
  const code = children?.toString().trim() ?? "";
  const languageString = className?.split("-")[1];

  if (isInline || languageString === undefined) {
    return <InlineCode code={code} />;
  }

  const language = getLanguage(languageString);
  return <FramedCodeBlock code={code} language={language} />;
};

export { CodeSnippet };
