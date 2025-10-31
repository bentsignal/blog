import * as AuthContext from "@/context/auth-context";
import * as ChatContext from "@/context/chat-context";
import * as ConvexContext from "@/context/convex-context";
import * as ThemeContext from "@/context/theme-context";
import { headers } from "next/headers";
import * as Sidebar from "@/ui/atoms/sidebar";
import { getToken } from "@/lib/auth-server";

export const Provider = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const headersList = await headers();
  const slug = headersList.get("x-slug");

  const token = await getToken();
  const authed = token !== undefined;

  return (
    <ConvexContext.Provider>
      <AuthContext.Provider isAuthenticatedServerSide={authed}>
        <ThemeContext.Provider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ChatContext.Provider>
            <Sidebar.Provider>{children}</Sidebar.Provider>
          </ChatContext.Provider>
        </ThemeContext.Provider>
      </AuthContext.Provider>
    </ConvexContext.Provider>
  );
};
