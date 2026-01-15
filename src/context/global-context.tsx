import { cookies, headers } from "next/headers";
import { Provider as ConvexProvider } from "@/context/convex-context";
import * as Auth from "@/features/auth/atom";
import { getServersideToken } from "@/features/auth/lib/auth-server";
import * as Chat from "@/features/chat/atom";
import * as Sidebar from "@/atoms/sidebar";
import * as Theme from "@/atoms/theme";

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
      ? undefined
      : sidebarCookie.value === "true";

  return (
    <ConvexProvider>
      <Auth.Store isAuthenticatedServerSide={authed}>
        <Theme.Store
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
          themeCookieValue={themeCookie?.value}
        >
          <Chat.Store slugFromHeaders={slug}>
            <Sidebar.Provider defaultOpen={shouldShowSidebar}>
              {children}
            </Sidebar.Provider>
          </Chat.Store>
        </Theme.Store>
      </Auth.Store>
    </ConvexProvider>
  );
};
