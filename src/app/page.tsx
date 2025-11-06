import { Provider as ListProvider } from "@/context/list-context";
import { posts, postSlugs } from "@/data/posts";
import * as Abyss from "@/ui/atoms/abyss";
import * as List from "@/ui/atoms/list";
import PostCard from "@/ui/molecules/post-card";
import { TopControls } from "@/ui/molecules/top-controls";

export default function HomePage() {
  return (
    <ListProvider>
      <List.Frame>
        <TopControls className="absolute top-0 left-0 z-6" />
        <Abyss.Top />
        <List.Body fade="md">
          <div className="mx-auto my-16 flex max-w-xl flex-col gap-4 px-4">
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
