import Image from "next/image";
import { SocialsBar } from "@/features/socials/socials-bar";
import * as Abyss from "@/atoms/abyss";
import * as Scroll from "@/atoms/scroll";
import { Separator } from "@/atoms/separator";
import PostLink from "@/molecules/post-link";
import { TopControls } from "@/molecules/top-controls";
import pfp from "@/assets/pfp.webp";
import { posts, postSlugs } from "@/blog/posts";

export default function HomePage() {
  return (
    <Scroll.Store>
      <Scroll.Wrapper>
        <TopControls className="absolute top-0 left-0 z-6" />
        <Abyss.Top />
        <Scroll.Container fade="md">
          <Scroll.Content className="mx-auto my-16 flex max-w-xl flex-col gap-4 px-4">
            <div className="flex items-center gap-4">
              <Image
                src={pfp}
                alt="Profile Picture"
                width={80}
                height={80}
                className="rounded-full"
                priority
              />
              <div className="flex flex-col justify-center">
                <span className="font-semibold">shawn</span>
                <span className="text-muted-foreground text-sm">
                  @bentsignal
                </span>
              </div>
            </div>
            <span>
              This is a space for me to discuss software, photography,
              videography, music, math, and anything else I find interesting.
            </span>
            <Separator className="my-1" />
            <div className="flex flex-col gap-3">
              {postSlugs.map((slug) => {
                const post = posts[slug];
                return (
                  <PostLink slug={slug} key={slug}>
                    <div className="text-muted-foreground hover:text-primary flex flex-col items-start justify-between gap-1 rounded-md transition-colors duration-100 lg:flex-row lg:items-center">
                      <h2 className="font-semibold">{post.title}</h2>
                      <p className="hidden text-sm sm:block">
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
            <SocialsBar className="my-2 justify-center" />
          </Scroll.Content>
        </Scroll.Container>
        <Abyss.Bottom />
      </Scroll.Wrapper>
    </Scroll.Store>
  );
}
