"use client";

import { useState } from "react";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { UserButton } from "@clerk/nextjs";
import { Spinner } from "./spinner";
import { Button } from "./ui/button";

export const ProfileButton = () => {
  return (
    <UserButton
      fallback={<div className="bg-muted-foreground size-7 rounded-full" />}
    />
  );
};

export const JoinConversationButton = ({
  onClick,
  ...props
}: React.ComponentProps<"button">) => {
  const [loading, setLoading] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    setLoading(true);
  };

  return (
    <Button
      className="min-w-46 font-bold"
      {...props}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? <Spinner /> : "Join the conversation"}
    </Button>
  );
};

export const SignInComponent = ({
  fallback,
  children,
}: {
  fallback: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <SignIn.Root fallback={fallback}>
      <SignIn.Step name="start">
        <Clerk.Connection name="github" asChild>
          {children}
        </Clerk.Connection>
      </SignIn.Step>
    </SignIn.Root>
  );
};
