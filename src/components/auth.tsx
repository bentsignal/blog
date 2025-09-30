"use client";

import { useCallback, useMemo, useState } from "react";
import {
  ContextSelector,
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Spinner } from "./spinner";
import { Button } from "./ui/button";
import * as Popover from "./ui/popover";
import { authClient } from "@/lib/auth-client";

interface Auth {
  signedIn: boolean;
  inProgress: boolean;
  signOut: () => Promise<void>;
  signIn: () => Promise<void>;
}

export const AuthContext = createContext<Auth>({} as Auth);

export const useAuth = <T,>(selector: ContextSelector<Auth, T>) =>
  useContextSelector(AuthContext, selector);

export const Provider = ({
  authed,
  children,
}: {
  authed: boolean;
  children: React.ReactNode;
}) => {
  const router = useRouter();

  const [inProgress, setInProgress] = useState(false);

  const signOut = useCallback(async () => {
    await authClient.signOut(
      {},
      {
        onResponse: () => {
          router.refresh();
        },
      },
    );
  }, [router]);

  const signIn = useCallback(async () => {
    try {
      setInProgress(true);
      await authClient.signIn.social(
        { provider: "github" },
        {
          onError: (error) => {
            setInProgress(false);
            console.error(error);
            toast.error(
              "Ran into an error trying to sign in, see console for more details.",
            );
          },
        },
      );
    } catch (error) {
      console.error(error);
      setInProgress(false);
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      signedIn: authed,
      inProgress,
      signOut,
      signIn,
    }),
    [authed, inProgress, signOut, signIn],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const Profile = () => {
  const signOut = useAuth((c) => c.signOut);
  const [open, setOpen] = useState(false);
  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="flex items-center py-1 pr-1 pl-3"
    >
      <Popover.Popover open={open} onOpenChange={setOpen}>
        <Popover.PopoverTrigger className="">
          <div className="bg-muted-foreground size-7 rounded-full" />
        </Popover.PopoverTrigger>
        <Popover.PopoverContent className="mt-1 w-auto p-1">
          <Button
            variant="link"
            onClick={async () => {
              setOpen(false);
              await signOut();
            }}
            className="focus-visible:ring-0"
          >
            Sign Out
          </Button>
        </Popover.PopoverContent>
      </Popover.Popover>
    </div>
  );
};

export const SignIn = () => {
  const inProgress = useAuth((c) => c.inProgress);
  const signIn = useAuth((c) => c.signIn);
  return (
    <Button className="min-w-46 font-bold" onClick={signIn}>
      {inProgress ? <Spinner /> : "Join the conversation"}
    </Button>
  );
};
