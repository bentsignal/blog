"use client";

import { Button } from "@/ui/atoms/button";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-1 px-4">
      <h1 className="text-4xl font-bold">Oops</h1>
      <p className="text-muted-foreground mb-1 text-lg">
        We couldn't find the page you were looking for. Sorry about that.
      </p>
      {/* this weird routing is due to a known issue in next.js that occurs when using parallel routes */}
      <Button variant="outline" onClick={() => (window.location.href = "/")}>
        Back to Home
      </Button>
    </div>
  );
}
