"use client";

import { useEffect } from "react";
import * as Icons from "lucide-react";
import { useStore as useComposerStore } from "./composer-store";
import { cn } from "@/utils/style-utils";
import * as Auth from "@/features/auth/atom";
import {
  MAX_MESSAGE_LENGTH,
  MIN_MESSAGE_LENGTH,
} from "@/features/messages/config";
import { Button } from "@/atoms/button";
import * as ToolTip from "@/atoms/tooltip";

const Container = ({
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

const Input = ({
  placeholder = "Aa",
  className,
}: {
  placeholder?: string;
  className?: string;
}) => {
  const inputRef = useComposerStore((s) => s.inputRef);
  const inputValue = useComposerStore((s) => s.inputValue);
  const setInputValue = useComposerStore((s) => s.setInputValue);
  const onSubmit = useComposerStore((s) => s.onSubmit);
  const submitDisabled = useComposerStore((s) => s.submitDisabled);
  const onCancel = useComposerStore((s) => s.onCancel);
  const imNotSignedIn = Auth.useStore((s) => !s.imSignedIn);

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

const Send = () => {
  const onSubmit = useComposerStore((s) => s.onSubmit);
  const submitDisabled = useComposerStore((s) => s.inputValue.trim() === "");
  const imNotSignedIn = Auth.useStore((s) => !s.imSignedIn);

  if (imNotSignedIn) return <Auth.JoinButton />;

  return (
    <ToolTip.Frame>
      <ToolTip.Trigger asChild>
        <Button
          onClick={onSubmit}
          size="icon"
          disabled={submitDisabled}
          className="bg-green-800 hover:bg-green-900"
          aria-label="Send message button"
        >
          <Icons.Send className="h-4 w-4 text-white" />
        </Button>
      </ToolTip.Trigger>
      <ToolTip.Content>Send</ToolTip.Content>
    </ToolTip.Frame>
  );
};

const Cancel = () => {
  const onCancel = useComposerStore((s) => s.onCancel);

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

const Save = () => {
  const onSubmit = useComposerStore((s) => s.onSubmit);
  const submitDisabled = useComposerStore((s) => s.submitDisabled);

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

const InlineHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-muted/40 mt-3 flex w-full items-center gap-1 p-2">
      <span className="text-muted-foreground text-sm">{children}</span>
    </div>
  );
};

export { Container, Input, Send, Cancel, Save, InlineHeader };
