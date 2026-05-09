"use client";

import { Toaster as Sonner } from "sonner";
import type React from "react";

export function Toaster({ ...props }: React.ComponentProps<typeof Sonner>) {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
}
