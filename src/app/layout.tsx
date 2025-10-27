import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GlobalProviders } from "@/context/global-context";
import * as ListContext from "@/context/list-context";
import * as SearchContext from "@/context/search-context";
import * as Abyss from "@/ui/atoms/abyss";
import * as List from "@/ui/atoms/list";
import * as Sidebar from "@/ui/atoms/sidebar";
import { Toaster } from "@/ui/atoms/toast";
import { ChatWindow } from "@/ui/molecules/chat-window";
import { TopControls } from "@/ui/molecules/top-controls";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GlobalProviders>
          <Toaster />
          <Sidebar.Frame className="max-w-screen sm:max-w-lg">
            <Sidebar.Content className="flex items-center">
              <SearchContext.Provider>
                <ChatWindow />
              </SearchContext.Provider>
            </Sidebar.Content>
          </Sidebar.Frame>
          <ListContext.Provider>
            <List.Frame>
              <TopControls className="absolute top-0 left-0 z-6" />
              <Abyss.Top />
              <List.Content className="max-h-screen mask-t-from-97% mask-b-from-97%">
                {children}
              </List.Content>
              <div className="absolute right-0 bottom-0 z-6 flex flex-col gap-2 p-4">
                <List.ScrollToTopButton />
                <List.ScrollToBottomButton />
              </div>
              <Abyss.Bottom />
            </List.Frame>
          </ListContext.Provider>
        </GlobalProviders>
      </body>
    </html>
  );
}
