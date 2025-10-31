import { posts } from "@/data/posts";
import Link from "next/link";
import * as Card from "@/ui/atoms/card";

export default function HomePage() {
  return (
    <div className="mx-auto flex h-screen max-w-xl flex-col justify-center gap-4">
      {Object.entries(posts).map(([slug, post]) => (
        <Link href={`/${slug}`} key={slug}>
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
