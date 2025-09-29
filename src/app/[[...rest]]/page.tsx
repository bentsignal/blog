import { SignedOut } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import * as Auth from "@/components/auth";
import { Phone } from "@/components/phone";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function Home() {
  const { userId } = await auth();
  const authed = userId !== null;
  return (
    <div className="flex h-screen flex-col items-center justify-center overflow-y-auto py-4">
      <SignedOut>
        <Auth.Modal />
      </SignedOut>
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <Phone authed={authed} />
    </div>
  );
}
