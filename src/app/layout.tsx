import "./globals.css";
import { Inter, Roboto_Mono } from "next/font/google";
import type { Metadata } from "next";
import * as Theme from "@/features/theme/atom";
import { defaultTheme } from "@/features/theme/themes";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <ReactScan />
      </head>
      <body
        className={`${inter.variable} ${robotoMono.variable} ${defaultTheme.className} flex min-h-svh w-full overflow-y-hidden antialiased`}
      >
        <Theme.Store
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
          initialTheme={defaultTheme}
        >
          <Toaster />
          {children}
        </Theme.Store>
      </body>
    </html>
  );
}

const ReactScan = () => {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }
  return (
    <>
      {/* eslint-disable-next-line next/no-sync-scripts */}
      <script
        crossOrigin="anonymous"
        src="//unpkg.com/react-scan/dist/auto.global.js"
      />
    </>
  );
};
