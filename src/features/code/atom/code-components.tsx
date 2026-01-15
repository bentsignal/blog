"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  List,
  ListOrdered,
  TextAlignStart,
  TextWrap,
} from "lucide-react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { toast } from "sonner";
import { useCodeTheme } from "../hooks/use-code-theme";
import { useStore as useCodeStore } from "./code-store";
import { cn } from "@/utils/style-utils";
import { useIsClient } from "@/hooks/use-is-client";
import { registerLanguages } from "@/features/code/languages/registry";
import { Button } from "@/atoms/button";
import * as Tooltip from "@/atoms/tooltip";

// init syntax highlighter
registerLanguages();

const Block = () => {
  const codeTheme = useCodeTheme();
  const code = useCodeStore((s) => s.code);
  const language = useCodeStore((s) => s.language);
  const showLineNumbers = useCodeStore((s) => s.showLineNumbers);
  const wrapLines = useCodeStore((s) => s.wrapLines);

  return (
    <SyntaxHighlighter
      language={language?.id}
      style={codeTheme}
      showLineNumbers={showLineNumbers}
      codeTagProps={{
        className: "bg-transparent",
        style: {
          whiteSpace: wrapLines ? "pre-wrap" : "pre",
          wordBreak: wrapLines ? "break-word" : "normal",
          overflowWrap: wrapLines ? "anywhere" : "normal",
        },
      }}
      PreTag={({ children }) => (
        <pre
          className={cn(
            "text-card-foreground overflow-y-hidden text-xs",
            wrapLines
              ? "overflow-x-auto whitespace-pre-wrap"
              : "overflow-x-auto whitespace-pre",
          )}
        >
          {children}
        </pre>
      )}
    >
      {code}
    </SyntaxHighlighter>
  );
};

const LanguageIdentifier = () => {
  const language = useCodeStore((s) => s.language);

  const { label, icon: Icon } = language;

  return (
    <div className="flex items-center gap-2">
      {Icon && <Icon className="h-4 w-4" />}
      <span className="text-muted-foreground text-sm font-semibold">
        {label}
      </span>
    </div>
  );
};

const CopyButton = () => {
  const code = useCodeStore((s) => s.code);

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
};

const LineNumbersButton = () => {
  const showLineNumbers = useCodeStore((s) => s.showLineNumbers);
  const toggleLineNumbers = useCodeStore((s) => s.toggleLineNumbers);

  return (
    <Tooltip.Frame>
      <Tooltip.Trigger asChild>
        <Button
          onClick={toggleLineNumbers}
          size="sm"
          variant="ghost"
          aria-label="Toggle line numbers next to each line of code"
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

const LineWrappingButton = () => {
  const wrapLines = useCodeStore((s) => s.wrapLines);
  const toggleLineWrapping = useCodeStore((s) => s.toggleLineWrapping);

  return (
    <Tooltip.Frame>
      <Tooltip.Trigger asChild>
        <Button
          onClick={toggleLineWrapping}
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0"
          aria-label="Toggle line wrapping"
        >
          {wrapLines ? (
            <TextAlignStart className="h-4 w-4" />
          ) : (
            <TextWrap className="h-4 w-4" />
          )}
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>
        {wrapLines ? "Disable line wrapping" : "Enable line wrapping"}
      </Tooltip.Content>
    </Tooltip.Frame>
  );
};

export {
  Block,
  LanguageIdentifier,
  CopyButton,
  LineNumbersButton,
  LineWrappingButton,
};
