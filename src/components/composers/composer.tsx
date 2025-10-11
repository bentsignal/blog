"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ContextSelector,
  createContext,
  useContextSelector,
  useHasParentContext,
} from "@fluentui/react-context-selector";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { MAX_MESSAGE_LENGTH, MIN_MESSAGE_LENGTH } from "@/lib/config";
import { cn } from "@/lib/utils";

type Style = {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
};

interface ComposerInputProps {
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  inputValue: string;
  setInputValue: (value: string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
}

interface ComposerContextType extends ComposerInputProps {
  style: Style;
  setStyle: React.Dispatch<React.SetStateAction<Style>>;
  submitDisabled: boolean;
}

export const ComposerContext = createContext<ComposerContextType>(
  {} as ComposerContextType,
);

const useComposer = <T,>(selector: ContextSelector<ComposerContextType, T>) =>
  useContextSelector(ComposerContext, selector);

export const Provider = ({
  onSubmit,
  inputValue,
  setInputValue,
  inputRef,
  onCancel,
  children,
}: ComposerInputProps & { children: React.ReactNode }) => {
  const [style, setStyle] = useState<Style>({
    bold: false,
    italic: false,
    strikethrough: false,
  });
  const submitDisabled = inputValue.trim() === "";

  const contextValue = useMemo(
    () => ({
      inputRef,
      inputValue,
      setInputValue,
      onSubmit,
      onCancel,
      style,
      setStyle,
      submitDisabled,
    }),
    [
      inputRef,
      inputValue,
      setInputValue,
      onSubmit,
      onCancel,
      style,
      submitDisabled,
    ],
  );

  return (
    <ComposerContext.Provider value={contextValue}>
      {children}
    </ComposerContext.Provider>
  );
};

export const Frame = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "bg-muted flex items-center justify-center rounded-2xl p-4",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const Input = ({
  placeholder = "Aa",
  className,
}: {
  placeholder?: string;
  className?: string;
}) => {
  const hasParentContext = useHasParentContext(ComposerContext);
  if (!hasParentContext) {
    throw new Error("ComposerContext not found");
  }

  const inputRef = useComposer((c) => c.inputRef);
  const inputValue = useComposer((c) => c.inputValue);
  const setInputValue = useComposer((c) => c.setInputValue);
  const onSubmit = useComposer((c) => c.onSubmit);
  const submitDisabled = useComposer((c) => c.submitDisabled);
  const onCancel = useComposer((c) => c.onCancel);

  useEffect(() => {
    const textarea = inputRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const lineHeight = 20;
    const maxLines = 5;
    const maxHeight = lineHeight * maxLines;
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;
  }, [inputValue, inputRef]);

  return (
    <textarea
      id="composer-input"
      ref={inputRef}
      rows={1}
      className={cn(
        "mr-2 flex w-full min-w-0 flex-1",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "resize-none select-none",
        "scrollbar-track-transparent scrollbar-thin scrollbar-thumb-card overflow-y-auto",
        "text-sm transition-[color,box-shadow]",
        "focus-visible:ring-ring/0 outline-none",
        "selection:bg-primary selection:text-primary-foreground",
        className,
      )}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={(e) => {
        if (submitDisabled) return;
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          onSubmit();
          if (inputRef.current) {
            inputRef.current.style.height = "auto";
          }
        }
        if (e.key === "Escape" && !e.shiftKey) {
          onCancel?.();
        }
      }}
      placeholder={placeholder}
      minLength={MIN_MESSAGE_LENGTH}
      maxLength={MAX_MESSAGE_LENGTH}
    />
  );
};

export const Send = () => {
  const hasParentContext = useHasParentContext(ComposerContext);
  if (!hasParentContext) {
    throw new Error("ComposerContext not found");
  }

  const onSubmit = useComposer((c) => c.onSubmit);
  const submitDisabled = useComposer((c) => c.inputValue.trim() === "");

  return (
    <Button
      onClick={onSubmit}
      size="icon"
      disabled={submitDisabled}
      className="bg-green-800 hover:bg-green-900"
    >
      <Icons.Send className="h-4 w-4 text-white" />
    </Button>
  );
};

export const Cancel = () => {
  const hasParentContext = useHasParentContext(ComposerContext);
  if (!hasParentContext) {
    throw new Error("ComposerContext not found");
  }

  const onCancel = useComposer((c) => c.onCancel);

  return (
    <Button variant="destructive" size="icon" onClick={onCancel}>
      <Icons.X className="text-white" />
    </Button>
  );
};

export const Save = () => {
  const hasParentContext = useHasParentContext(ComposerContext);
  if (!hasParentContext) {
    throw new Error("ComposerContext not found");
  }

  const onSubmit = useComposer((c) => c.onSubmit);
  const submitDisabled = useComposer((c) => c.submitDisabled);

  return (
    <Button
      className="bg-green-800 hover:bg-green-900"
      size="icon"
      onClick={onSubmit}
      disabled={submitDisabled}
    >
      <Icons.Save className="text-white" />
    </Button>
  );
};

export const InlineHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-muted/40 mt-3 flex w-full items-center gap-1 p-2">
      <span className="text-muted-foreground text-sm">{children}</span>
    </div>
  );
};
