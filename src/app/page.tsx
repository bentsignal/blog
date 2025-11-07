import pfp from "@/assets/pfp.webp";
import { Provider as ListProvider } from "@/context/list-context";
import { posts, postSlugs } from "@/data/posts";
import Image from "next/image";
import * as Abyss from "@/ui/atoms/abyss";
import * as List from "@/ui/atoms/list";
import { Separator } from "@/ui/atoms/separator";
import PostCard from "@/ui/molecules/post-card";
import { Socials } from "@/ui/molecules/socials";
import { TopControls } from "@/ui/molecules/top-controls";

export default function HomePage() {
  return (
    <ListProvider>
      <List.Frame>
        <TopControls className="absolute top-0 left-0 z-6" />
        <Abyss.Top />
        <List.Body fade="md">
          <div className="mx-auto my-16 flex max-w-xl flex-col gap-4 px-4">
            <div className="flex items-center gap-4">
              <Image
                src={pfp}
                alt="Profile Picture"
                width={100}
                height={100}
                className="rounded-full"
              />
              <div className="flex flex-col">
                <span className="font-semibold">shawn</span>
                <span className="text-muted-foreground mb-3 text-sm">
                  @bentsignal
                </span>
                <Socials />
              </div>
            </div>
            <Separator className="my-1" />
            {postSlugs.map((slug) => {
              const post = posts[slug];
              return <PostCard post={post} slug={slug} key={slug} />;
            })}
          </div>
        </List.Body>
        <Abyss.Bottom />
      </List.Frame>
    </ListProvider>
  );
}
