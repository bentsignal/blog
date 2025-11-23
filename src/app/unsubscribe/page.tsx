import { api } from "@/convex/_generated/api";
import { validateNotificationType } from "@/convex/notifications";
import { fetchMutation } from "convex/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/atoms/button";

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const { userId, type } = params;
  if (typeof type !== "string" || typeof userId !== "string") {
    return redirect("/");
  }
  const notificationType = validateNotificationType(type);
  if (!notificationType) {
    console.error(`Invalid notification type: ${type}, userId: ${userId}`);
    return redirect("/");
  }
  await fetchMutation(api.preferences.unsubscribe, {
    userId,
    type: notificationType,
  });
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-1 px-4">
      <h1 className="text-4xl font-bold">Successfully updated preferences</h1>
      <p className="text-muted-foreground mb-1 text-center text-lg">
        You will no longer receive notifications of this type.
      </p>
      <Link href="/">
        <Button variant="outline">Back to Home</Button>
      </Link>
    </div>
  );
}
