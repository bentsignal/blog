import "./globals.css";
import { Inter, Roboto_Mono } from "next/font/google";
import type { Metadata, Viewport } from "next";
import * as Theme from "@/features/theme/atom";
import { defaultTheme } from "@/features/theme/themes";
import { Stars } from "@/atoms/stars";
import { Toaster } from "@/atoms/toast";

const inter = Inter({
  variable: "--font-inter",
  weight: "variable",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "blog ❖ bentsignal",
    template: "%s ❖ bentsignal",
  },
  description: "A space for me to share my thoughts.",
};

export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${robotoMono.variable} ${defaultTheme.className} w-full antialiased md:flex md:min-h-svh md:overflow-y-hidden`}
      >
        <Theme.Store
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
          initialTheme={defaultTheme}
        >
          <Stars />
          <Toaster />
          {children}
        </Theme.Store>
      </body>
    </html>
  );
}
