import { Phone } from "@/components/phone";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function Home() {
  return (
    <div className="flex h-screen flex-col items-center justify-center overflow-y-auto py-4">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <Phone />
    </div>
  );
}
