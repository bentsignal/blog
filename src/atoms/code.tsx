"use client";

import { ReactNode, useState } from "react";
import { languages } from "@/data/languages";
import { cn } from "@/utils/style-utils";
import { Check, Copy, List, ListOrdered } from "lucide-react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import {
  base16AteliersulphurpoolLight,
  nord,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";
import { Button } from "@/atoms/button";
import { ThemeContext, useTheme } from "@/atoms/theme";
import * as Tooltip from "@/atoms/tooltip";
import { createContext, useRequiredContext } from "@/lib/context";
import { useIsClient } from "@/hooks/use-is-client";

SyntaxHighlighter.registerLanguage("tsx", tsx);

export const { Context: CodeContext, useContext: useCode } = createContext<{
  code: string;
  language: string | undefined;
  codeTheme: Record<string, React.CSSProperties>;
  showLineNumbers: boolean;
  toggleShowLineNumbers: () => void;
}>({ displayName: "CodeContext" });

export function Provider({
  inline = false,
  className,
  children,
}: {
  inline?: boolean;
  className?: string;
  children: ReactNode;
}) {
  useRequiredContext(ThemeContext);

  const theme = useTheme((c) => c.theme);
  const codeTheme = theme === "dark" ? nord : base16AteliersulphurpoolLight;
  const code = children?.toString().trim() ?? "";
  const languageString = className?.split("-")[1];
  const language = languageString === "no_header" ? undefined : languageString;
  const isInline = inline || languageString === undefined;

  const [showLineNumbers, setShowLineNumbers] = useState(false);

  if (!children) return null;

  const toggleShowLineNumbers = () => setShowLineNumbers((prev) => !prev);

  const contextValue = {
    code,
    language,
    codeTheme,
    showLineNumbers,
    toggleShowLineNumbers,
  };

  return (
    <CodeContext.Provider value={contextValue}>
      {isInline ? <Inline /> : <Block />}
    </CodeContext.Provider>
  );
}

export const Inline = () => {
  useRequiredContext(CodeContext);
  const codeTheme = useCode((c) => c.codeTheme);
  const code = useCode((c) => c.code);
  return (
    <SyntaxHighlighter
      style={codeTheme}
      codeTagProps={{ className: "bg-transparent" }}
      PreTag={({ children }) => (
        <code className="not-prose bg-card dark:bg-muted inline-flex overflow-x-auto rounded-md px-1.5 py-0.5 font-mono text-sm">
          {children}
        </code>
      )}
    >
      {code}
    </SyntaxHighlighter>
  );
};

const Header = () => {
  useRequiredContext(CodeContext);

  const language = useCode((c) => c.language);

  if (language === undefined) return null;

  return (
    <div className="dark:bg-border bg-input flex h-14 w-full items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <Language />
      </div>
      <div className="flex items-center gap-2">
        <LineNumbersButton />
        <CopyButton />
      </div>
    </div>
  );
};

export const Block = () => {
  useRequiredContext(CodeContext);

  const codeTheme = useCode((c) => c.codeTheme);
  const code = useCode((c) => c.code);
  const language = useCode((c) => c.language);
  const showLineNumbers = useCode((c) => c.showLineNumbers);

  return (
    <div className="not-prose border-border group relative my-8 w-full overflow-hidden rounded-xl border-1">
      <Header />
      <div
        className={cn(
          "not-prose flex w-full flex-col overflow-clip border",
          "border-border bg-card supports-[backdrop-filter]:bg-card/50 text-card-foreground rounded-xl backdrop-blur-sm",
          "rounded-t-none border-none bg-transparent",
        )}
      >
        <SyntaxHighlighter
          language={language}
          style={codeTheme}
          showLineNumbers={showLineNumbers}
          codeTagProps={{ className: "bg-transparent" }}
          PreTag={({ children }) => (
            <pre className="my-1 overflow-x-auto bg-transparent px-6 py-5 text-xs">
              {children}
            </pre>
          )}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export const Language = () => {
  useRequiredContext(CodeContext);

  const language = useCode((c) => c.language);

  if (!language) return null;

  if (language in languages) {
    const { label } = languages[language as keyof typeof languages];
    return (
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-sm font-semibold">
          {label}
        </span>
      </div>
    );
  }
};

export function CopyButton() {
  useRequiredContext(CodeContext);

  const code = useCode((c) => c.code);

  const [copied, setCopied] = useState(false);
  const isClient = useIsClient();

  const disabled = (!navigator?.clipboard && isClient) || copied;

  const handleCopy = async () => {
    try {
      const textToCopy = code.trim();
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (err) {
      toast.error("Failed to copy text, see console for more details");
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Tooltip.Frame>
      <Tooltip.Trigger asChild>
        <Button
          onClick={handleCopy}
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0"
          disabled={disabled}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>{copied ? "Copied" : "Copy"}</Tooltip.Content>
    </Tooltip.Frame>
  );
}

export const LineNumbersButton = () => {
  useRequiredContext(CodeContext);

  const showLineNumbers = useCode((c) => c.showLineNumbers);
  const toggleShowLineNumbers = useCode((c) => c.toggleShowLineNumbers);

  return (
    <Tooltip.Frame>
      <Tooltip.Trigger asChild>
        <Button
          onClick={toggleShowLineNumbers}
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0"
        >
          {showLineNumbers ? (
            <List className="h-4 w-4" />
          ) : (
            <ListOrdered className="h-4 w-4" />
          )}
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>
        {showLineNumbers ? "Hide line numbers" : "Show line numbers"}
      </Tooltip.Content>
    </Tooltip.Frame>
  );
};
