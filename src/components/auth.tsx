"use client";

import { useState } from "react";
import { XIcon } from "lucide-react";
import { create } from "zustand";
import { Spinner } from "./spinner";
import { Button } from "./ui/button";
import * as Dialog from "@/components/ui/dialog";
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

const useAuthModal = create<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));

export const Modal = () => {
  const { open, setOpen } = useAuthModal();
  const [loading, setLoading] = useState(false);

  return (
    <Dialog.Dialog open={open} onOpenChange={setOpen}>
      <Dialog.DialogContent
        showCloseButton={false}
        className="reltative flex items-center justify-center focus:outline-none"
      >
        <Dialog.DialogHeader className="sr-only">
          <Dialog.DialogTitle>Sign in</Dialog.DialogTitle>
        </Dialog.DialogHeader>
        <span>Sign in to send messages</span>
        <Button
          onClick={async () => {
            try {
              setLoading(true);
              await authClient.signIn.social({ provider: "github" });
            } catch (error) {
              console.error(error);
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? <Spinner /> : "Sign in with Github"}
        </Button>
        <div className="absolute top-0 right-2">
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <XIcon />
          </Button>
        </div>
      </Dialog.DialogContent>
    </Dialog.Dialog>
  );
};
