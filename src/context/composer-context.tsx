"use client";

import { validateMessage } from "@/utils/message-utils";
import { createContext } from "@/lib/context";

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
