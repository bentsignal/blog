import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GlobalProviders } from "@/context/global-context";
import * as SearchContext from "@/context/search-context";
import { headers } from "next/headers";
import { Toaster } from "@/ui/atoms/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "blog ❖ bentsignal",
    template: "%s ❖ bentsignal",
  },
  description: "A space for me to share my thoughts",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const slug = headersList.get("x-slug");
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <p className="hidden">slug: {slug}</p>
        <GlobalProviders>
          <Toaster />
          <SearchContext.Provider>{children}</SearchContext.Provider>
        </GlobalProviders>
      </body>
    </html>
  );
}
