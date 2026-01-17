import "./globals.css";
import { Inter, Roboto_Mono } from "next/font/google";
import { cookies, headers } from "next/headers";
import type { Metadata } from "next";
import { Provider as ConvexProvider } from "@/context/convex-context";
import * as Auth from "@/features/auth/atom";
import { getServersideToken } from "@/features/auth/lib/auth-server";
import { ChannelListStore } from "@/features/channel/molecules/channel-list";
import * as Chat from "@/features/chat/atom";
import { ChatWindow } from "@/features/chat/molecules/chat-window";
import * as Search from "@/features/search/atom";
import * as Theme from "@/features/theme/atom";
import { getTheme } from "@/features/theme/utils";
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
  const headersList = await headers();
  const slug = headersList.get("x-slug");

  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme");
  const theme = getTheme(themeCookie?.value);
  const sidebarCookie = cookieStore.get("sidebar_state");

  const token = await getServersideToken();
  const authed = token !== undefined;

  const shouldShowSidebar =
    sidebarCookie?.value === undefined
      ? undefined
      : sidebarCookie.value === "true";

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ReactScan />
      </head>
      <body
        className={`${inter.variable} ${robotoMono.variable} ${theme.className} overflow-y-hidden antialiased`}
      >
        <ConvexProvider>
          <Auth.Store isAuthenticatedServerSide={authed}>
            <Theme.Store
              attribute="class"
              defaultTheme="dark"
              disableTransitionOnChange
              initialTheme={theme}
            >
              <Chat.Store slugFromHeaders={slug}>
                <Sidebar.Provider defaultOpen={shouldShowSidebar}>
                  <Toaster />
                  <Sidebar.Frame className="max-w-screen sm:max-w-lg">
                    <Sidebar.Content className="flex items-center">
                      <Search.Store>
                        <ChannelListStore>
                          <ChatWindow />
                        </ChannelListStore>
                      </Search.Store>
                    </Sidebar.Content>
                  </Sidebar.Frame>
                  {children}
                </Sidebar.Provider>
              </Chat.Store>
            </Theme.Store>
          </Auth.Store>
        </ConvexProvider>
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
