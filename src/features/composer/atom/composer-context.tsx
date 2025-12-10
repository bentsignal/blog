"use client";

import { validateMessage } from "@/features/messages/utils";
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

const { Context, useContext } = createContext<ComposerContextType>({
  displayName: "ComposerContext",
});

const Provider = ({
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

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export { Provider, Context, useContext };
