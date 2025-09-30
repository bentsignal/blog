import * as Auth from "@/components/auth";
import { Phone } from "@/components/phone";
import { ThemeToggle } from "@/components/theme-toggle";
import { getToken } from "@/lib/auth-server";

export default async function Home() {
  const token = await getToken();
  const authed = token !== undefined;
  return (
    <div className="flex h-screen flex-col items-center justify-center overflow-y-auto py-4">
      <Auth.Modal />
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <Phone authed={authed} />
    </div>
  );
}
