"use client";

import { useState } from "react";
import { Spinner } from "./spinner";
import { Button } from "./ui/button";
import { authClient } from "@/lib/auth-client";

export const Profile = () => {
  return (
    <div
      className="bg-muted-foreground size-7 rounded-full hover:cursor-pointer"
      onClick={async () => {
        await authClient.signOut();
      }}
    />
  );
};

export const SignIn = () => {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      className="min-w-46 font-bold"
      onClick={async () => {
        try {
          setLoading(true);
          await authClient.signIn.social({ provider: "github" });
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      }}
    >
      {loading ? <Spinner /> : "Join the conversation"}
    </Button>
  );
};
