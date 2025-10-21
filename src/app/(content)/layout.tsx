import * as ListContext from "@/context/list-context";
import { cn } from "@/utils/style-utils";
import * as Abyss from "@/ui/atoms/abyss";
import * as List from "@/ui/atoms/list";
import { TopControls } from "@/ui/molecules/top-controls";

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ListContext.Provider>
      <List.Frame>
        <TopControls className="absolute top-0 left-0 z-6" />
        <Abyss.Top />
        <List.Content className="max-h-screen">
          <div
            className={cn(
              "mx-auto my-16 max-w-3xl px-4",
              "prose dark:prose-invert prose-headings:mt-8 prose-headings:font-semibold",
              "prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg",
            )}
          >
            {children}
          </div>
        </List.Content>
        <div className="absolute right-0 bottom-0 z-6 flex flex-col gap-2 p-4">
          <List.ScrollToTopButton />
          <List.ScrollToBottomButton />
        </div>
        <Abyss.Bottom />
      </List.Frame>
    </ListContext.Provider>
  );
}
