import "./globals.css";
import { Inter, Roboto_Mono } from "next/font/google";
import type { Metadata } from "next";
import { Providers as GlobalProviders } from "@/context/global-context";
import { ChannelListProvider } from "@/features/channel/molecules/channel-list";
import { ChatWindow } from "@/features/chat/molecules/chat-window";
import * as Search from "@/features/search/atom";
import * as Sidebar from "@/atoms/sidebar";
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
        className={`${inter.variable} ${robotoMono.variable} gradient-background antialiased`}
      >
        <GlobalProviders>
          <Toaster />
          <Sidebar.Frame className="max-w-screen sm:max-w-lg">
            <Sidebar.Content className="flex items-center">
              <Search.Provider>
                <ChannelListProvider>
                  <ChatWindow />
                </ChannelListProvider>
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
      {/* eslint-disable-next-line next/no-sync-scripts */}
      <script
        crossOrigin="anonymous"
        src="//unpkg.com/react-scan/dist/auto.global.js"
      />
    </>
  );
};
