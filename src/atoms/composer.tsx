"use client";

import { useEffect } from "react";
import {
  MAX_MESSAGE_LENGTH,
  MIN_MESSAGE_LENGTH,
} from "@/config/message-config";
import * as Auth from "@/features/auth/atom";
import { validateMessage } from "@/utils/message-utils";
import { cn } from "@/utils/style-utils";
import * as Icons from "lucide-react";
import * as ToolTip from "./tooltip";
import { Button } from "@/atoms/button";
import { createContext, useRequiredContext } from "@/lib/context";

interface ComposerInputProps {
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  inputValue: string;
  setInputValue: (value: string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
}

interface ComposerContextType extends ComposerInputProps {
  submitDisabled: boolean;
}

export const { Context: ComposerContext, useContext: useComposer } =
  createContext<ComposerContextType>({ displayName: "ComposerContext" });

export const Provider = ({
  onSubmit,
  inputValue,
  setInputValue,
  inputRef,
  onCancel,
  children,
}: ComposerInputProps & { children: React.ReactNode }) => {
  const inputIsValid = validateMessage(inputValue) === "Valid";
  const submitDisabled = !inputIsValid;

  const contextValue = {
    inputRef,
    inputValue,
    setInputValue,
    onSubmit,
    onCancel,
    submitDisabled,
  };

  return (
    <ComposerContext.Provider value={contextValue}>
      {children}
    </ComposerContext.Provider>
  );
};

export const Container = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "bg-muted flex items-center justify-center rounded-2xl p-3",
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
  useRequiredContext(ComposerContext);

  const inputRef = useComposer((c) => c.inputRef);
  const inputValue = useComposer((c) => c.inputValue);
  const setInputValue = useComposer((c) => c.setInputValue);
  const onSubmit = useComposer((c) => c.onSubmit);
  const submitDisabled = useComposer((c) => c.submitDisabled);
  const onCancel = useComposer((c) => c.onCancel);
  const imNotSignedIn = Auth.useContext((c) => !c.imSignedIn);

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
        "mr-3 flex w-full min-w-0 flex-1 p-1",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "resize-none select-none",
        "scrollbar-track-transparent scrollbar-thin scrollbar-thumb-card overflow-y-auto",
        "transition-[color,box-shadow] sm:text-sm",
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
          e.preventDefault();
          inputRef.current?.blur();
          onCancel?.();
        }
      }}
      placeholder={placeholder}
      minLength={MIN_MESSAGE_LENGTH}
      maxLength={MAX_MESSAGE_LENGTH}
      disabled={imNotSignedIn}
    />
  );
};

export const Send = () => {
  useRequiredContext(ComposerContext);

  const onSubmit = useComposer((c) => c.onSubmit);
  const submitDisabled = useComposer((c) => c.inputValue.trim() === "");
  const imNotSignedIn = Auth.useContext((c) => !c.imSignedIn);

  if (imNotSignedIn) return <Auth.JoinButton />;

  return (
    <ToolTip.Frame>
      <ToolTip.Trigger asChild>
        <Button
          onClick={onSubmit}
          size="icon"
          disabled={submitDisabled}
          className="bg-green-800 hover:bg-green-900"
        >
          <Icons.Send className="h-4 w-4 text-white" />
        </Button>
      </ToolTip.Trigger>
      <ToolTip.Content>Send</ToolTip.Content>
    </ToolTip.Frame>
  );
};

export const Cancel = () => {
  useRequiredContext(ComposerContext);

  const onCancel = useComposer((c) => c.onCancel);

  return (
    <ToolTip.Frame>
      <ToolTip.Trigger asChild>
        <Button variant="destructive" size="icon" onClick={onCancel}>
          <Icons.X className="text-white" />
        </Button>
      </ToolTip.Trigger>
      <ToolTip.Content>Cancel</ToolTip.Content>
    </ToolTip.Frame>
  );
};

export const Save = () => {
  useRequiredContext(ComposerContext);

  const onSubmit = useComposer((c) => c.onSubmit);
  const submitDisabled = useComposer((c) => c.submitDisabled);

  return (
    <ToolTip.Frame>
      <ToolTip.Trigger asChild>
        <Button
          className="bg-green-800 hover:bg-green-900"
          size="icon"
          onClick={onSubmit}
          disabled={submitDisabled}
        >
          <Icons.Save className="text-white" />
        </Button>
      </ToolTip.Trigger>
      <ToolTip.Content>Save</ToolTip.Content>
    </ToolTip.Frame>
  );
};

export const InlineHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-muted/40 mt-3 flex w-full items-center gap-1 p-2">
      <span className="text-muted-foreground text-sm">{children}</span>
    </div>
  );
};
