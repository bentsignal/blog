"use client";

import {
  useRef,
  useState,
  useMemo,
  useCallback,
  createContext,
  use,
} from "react";
import { Send as SendIcon } from "lucide-react";

interface ComposerContextType {
  inputRef: React.RefObject<HTMLInputElement | null>;
  inputValue: string;
  setInputValue: (value: string) => void;
  onSend: () => void;
}

export const ComposerContext = createContext<ComposerContextType>(
  {} as ComposerContextType
);

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState("");

  const onSend = useCallback(() => {
    console.log(inputRef.current?.value || "");
    setInputValue("");
  }, []);

  const contextValue = useMemo(
    () => ({ inputRef, inputValue, setInputValue, onSend }),
    [inputValue, onSend]
  );

  return <ComposerContext value={contextValue}>{children}</ComposerContext>;
};

export const Frame = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-center bg-gray-900 rounded-xl p-4 border border-gray-800 gap-2">
      {children}
    </div>
  );
};

export const Input = () => {
  const { inputRef, inputValue, setInputValue } = use(ComposerContext);

  return (
    <input
      ref={inputRef}
      className="w-full p-2 rounded-md flex-1 min-w-xl focus:outline-none text-white"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder="Type your message here..."
    />
  );
};

export const Send = () => {
  const { onSend } = use(ComposerContext);

  return (
    <button
      onClick={onSend}
      className="p-2 rounded-md border border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors"
    >
      <SendIcon className="w-4 h-4 text-blue-500" />
    </button>
  );
};
