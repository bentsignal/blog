import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers as GlobalProviders } from "@/context/global-context";
import { ChatWindow } from "@/features/chat/molecules";
import * as Search from "@/features/search/atom";
import * as Sidebar from "@/atoms/sidebar";
import { Toaster } from "@/atoms/toast";

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
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ReactScan />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GlobalProviders>
          <Toaster />
          <Sidebar.Frame className="max-w-screen sm:max-w-lg">
            <Sidebar.Content className="flex items-center">
              <Search.Provider>
                <ChatWindow />
              </Search.Provider>
            </Sidebar.Content>
          </Sidebar.Frame>
          {children}
        </GlobalProviders>
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
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script
        crossOrigin="anonymous"
        src="//unpkg.com/react-scan/dist/auto.global.js"
      />
    </>
  );
};
