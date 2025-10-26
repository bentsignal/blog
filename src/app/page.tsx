import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import Link from "next/link";
import * as Card from "@/ui/atoms/card";

export default async function HomePage() {
  const posts = await fetchQuery(api.posts.getAll, {});
  return (
    <div className="mx-auto flex h-screen max-w-xl flex-col justify-center gap-4">
      {posts.map((post) => (
        <Link href={`/${post.slug}`} key={post._id}>
          <Card.Frame className="px-0 py-4">
            <Card.Content className="flex flex-col gap-1">
              <Card.Title>{post.title}</Card.Title>
              <Card.Description>{post.subtitle}</Card.Description>
            </Card.Content>
          </Card.Frame>
        </Link>
      ))}
    </div>
  );
}
