import { Provider as ChatWindowProvider } from "@/context/chat-window-context";
import { Provider as ConvexProvider } from "@/context/convex-context";
import * as Auth from "@/features/auth/atom";
import { getServersideToken } from "@/features/auth/lib/auth-server";
import { cookies, headers } from "next/headers";
import * as Sidebar from "@/atoms/sidebar";
import { Provider as ThemeProvider } from "@/atoms/theme";

export const Providers = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const headersList = await headers();
  const slug = headersList.get("x-slug");

  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme");
  const sidebarCookie = cookieStore.get("sidebar_state");

  const token = await getServersideToken();
  const authed = token !== undefined;

  const shouldShowSidebar =
    sidebarCookie?.value === undefined
      ? true
      : sidebarCookie.value === "true"
        ? true
        : false;

  return (
    <ConvexProvider>
      <Auth.Provider isAuthenticatedServerSide={authed}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
          themeCookieValue={themeCookie?.value}
        >
          <ChatWindowProvider slugFromHeaders={slug}>
            <Sidebar.Provider defaultOpen={shouldShowSidebar}>
              {children}
            </Sidebar.Provider>
          </ChatWindowProvider>
        </ThemeProvider>
      </Auth.Provider>
    </ConvexProvider>
  );
};
