import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GlobalProviders } from "@/context/global-context";
import { Toaster } from "@/ui/external/sonner";
import { RepoButton } from "@/ui/molecules/repo-button";
import { ThemeToggle } from "@/ui/molecules/theme-toggle";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "State of State",
  description: "How to build components in React",
};

export default function RootLayout({
  children,
  channel,
}: Readonly<{
  children: React.ReactNode;
  channel: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GlobalProviders>
          <Toaster />
          <div className="flex min-h-screen flex-col items-center justify-center gap-16 sm:flex-row">
            <div className="fixed top-4 right-4 z-50">
              <ThemeToggle />
            </div>
            <Hero />
            {channel}
          </div>
          {children}
        </GlobalProviders>
      </body>
    </html>
  );
}

const Hero = () => {
  return (
    <div className="flex flex-col items-start justify-center gap-1">
      <span className="text-6xl font-bold">State of ...State?</span>
      <span className="text-muted-foreground mb-1 text-xl">
        A modern approach to managing state in React
      </span>
      <Link href="https://github.com/bentsignal/state-of-state" target="_blank">
        <RepoButton />
      </Link>
    </div>
  );
};
