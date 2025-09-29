"use client";

import { useRef, useState } from "react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import * as Composer from "./composer";

export const MainComposer = () => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const sendMessage = useMutation(api.messages.sendMessage);
  const { isSignedIn } = useAuth();

  const onSubmit = async () => {
    if (!isSignedIn) {
      return;
    }
    const value = inputRef.current?.value || "";
    setInputValue("");
    await sendMessage({
      content: value,
    });
  };

  return (
    <Composer.Provider
      onSubmit={onSubmit}
      inputValue={inputValue}
      setInputValue={setInputValue}
      inputRef={inputRef}
    >
      <Composer.Frame>
        <Composer.Header />
        <Composer.Input />
        <Composer.Footer>
          <Composer.CommonActions />
          <Composer.Submit />
        </Composer.Footer>
      </Composer.Frame>
    </Composer.Provider>
  );
};
