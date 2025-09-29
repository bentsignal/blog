"use client";

import { SignIn as ClerkSignIn, UserButton } from "@clerk/nextjs";
import { shadcn } from "@clerk/themes";
import { XIcon } from "lucide-react";
import { create } from "zustand";
import { Button } from "./ui/button";
import * as Dialog from "@/components/ui/dialog";

export const Profile = () => {
  return (
    <UserButton
      fallback={<div className="bg-muted-foreground size-7 rounded-full" />}
    />
  );
};

export const SignIn = () => {
  const setOpen = useAuthModal((state) => state.setOpen);

  return (
    <Button className="min-w-46 font-bold" onClick={() => setOpen(true)}>
      Join the conversation
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

  return (
    <Dialog.Dialog open={open} onOpenChange={setOpen}>
      <Dialog.DialogContent
        showCloseButton={false}
        className="reltative flex items-center justify-center border-none bg-transparent focus:outline-none"
      >
        <Dialog.DialogHeader className="sr-only">
          <Dialog.DialogTitle>Sign in</Dialog.DialogTitle>
        </Dialog.DialogHeader>
        <ClerkSignIn
          appearance={{
            theme: shadcn,
          }}
        />
        <div className="absolute top-0 right-2">
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <XIcon />
          </Button>
        </div>
      </Dialog.DialogContent>
    </Dialog.Dialog>
  );
};
