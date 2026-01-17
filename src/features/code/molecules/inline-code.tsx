"use client";

import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { useCodeTheme } from "../hooks/use-code-theme";

const InlineCode = ({ code }: { code: string }) => {
  const codeTheme = useCodeTheme();
  return (
    <SyntaxHighlighter
      style={codeTheme}
      codeTagProps={{ className: "bg-transparent" }}
      PreTag={({ children }) => (
        <code className="not-prose bg-card/60 dark:bg-muted/60 mr-1 inline-flex overflow-x-auto rounded-md px-1.5 py-0.5 font-mono text-sm">
          {children}
        </code>
      )}
    >
      {code}
    </SyntaxHighlighter>
  );
};

export { InlineCode };
