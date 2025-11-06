import Link from "next/link";
import { Button } from "@/ui/atoms/button";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-1 px-4">
      <h1 className="text-4xl font-bold">Oops</h1>
      <p className="text-muted-foreground mb-1 text-center text-lg">
        We couldn't find the page you were looking for. Sorry about that.
      </p>
      <Link href="/">
        <Button variant="outline">Back to Home</Button>
      </Link>
    </div>
  );
}
