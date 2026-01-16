"use client";

import { createStore } from "rostra";
import { validateMessage } from "@/features/messages/utils";

interface StoreProps {
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  inputValue: string;
  setInputValue: (value: string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
}

interface StoreType extends StoreProps {
  submitDisabled: boolean;
}

function useInternalStore({
  onSubmit,
  inputValue,
  setInputValue,
  inputRef,
  onCancel,
}: StoreProps) {
  const inputIsValid = validateMessage(inputValue) === "Valid";
  const submitDisabled = !inputIsValid;

  return {
    inputRef,
    inputValue,
    setInputValue,
    onSubmit,
    onCancel,
    submitDisabled,
  };
}

export const { Store, useStore } = createStore<StoreProps, StoreType>(
  useInternalStore,
);
