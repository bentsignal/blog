import pfp from "@/assets/pfp.webp";
import { Provider as ListProvider } from "@/context/list-context";
import { posts, postSlugs } from "@/data/posts";
import Image from "next/image";
import * as Abyss from "@/ui/atoms/abyss";
import * as List from "@/ui/atoms/list";
import { Separator } from "@/ui/atoms/separator";
import PostLink from "@/ui/molecules/post-link";
import { Socials } from "@/ui/molecules/socials";
import { TopControls } from "@/ui/molecules/top-controls";

export default function HomePage() {
  return (
    <ListProvider>
      <List.Frame>
        <TopControls className="absolute top-0 left-0 z-6" />
        <Abyss.Top />
        <List.Container fade="md">
          <List.Content className="mx-auto my-16 flex max-w-xl flex-col gap-4 px-4">
            <div className="flex items-center gap-4">
              <Image
                src={pfp}
                alt="Profile Picture"
                width={100}
                height={100}
                className="rounded-full"
                priority
              />
              <div className="flex flex-col">
                <span className="font-semibold">shawn</span>
                <span className="text-muted-foreground mb-3 text-sm">
                  @bentsignal
                </span>
                <Socials />
              </div>
            </div>
            <span>
              I build software, film & edit videos, shoot film & digital
              photography, make digital art, and so much more. This is an
              ever-evolving space for me to document my thoughts on{" "}
              <i>anything and everything</i> I find interesting.
            </span>
            <Separator className="my-1" />
            <div className="flex flex-col gap-3">
              {postSlugs.map((slug) => {
                const post = posts[slug];
                return (
                  <PostLink slug={slug} key={slug}>
                    <div className="text-muted-foreground hover:text-primary flex items-center justify-between gap-1 rounded-md transition-colors duration-100">
                      <h2 className="font-semibold">{post.title}</h2>
                      <p className="text-sm">
                        {post.datePosted.toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </PostLink>
                );
              })}
            </div>
          </List.Content>
        </List.Container>
        <Abyss.Bottom />
      </List.Frame>
    </ListProvider>
  );
}
