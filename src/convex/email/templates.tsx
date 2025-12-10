import { env } from "@/convex/convex.env";
import type { EnhancedMessage } from "@/features/messages/types";
import {
  Body,
  Button,
  Head,
  Hr,
  Html,
  Img,
  Link,
  pixelBasedPreset,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { pretty, render } from "@react-email/render";
import type { NotificationType } from "../../types/notification-types";

const MAX_MESSAGES_TO_SHOW = 5;

export default async function renderReplyNotificationEmail({
  messages,
  userId,
}: {
  messages: {
    originalMessage: EnhancedMessage;
    replyMessage: EnhancedMessage;
  }[];
  userId: string;
}) {
  const origin = env.SITE_URL;
  const notificationType = "replies" as const satisfies NotificationType;
  return pretty(
    await render(
      <Html>
        <Tailwind config={{ presets: [pixelBasedPreset] }}>
          <Head />
          <Body className="mx-auto max-w-xl px-4 pt-2 pb-8">
            {messages
              .slice(0, MAX_MESSAGES_TO_SHOW)
              .map(({ originalMessage, replyMessage }, index) => (
                <Section key={index}>
                  <Message message={originalMessage} />
                  <div className="border-l-2 border-gray-200 pl-6">
                    <Message message={replyMessage} />
                  </div>
                  <Button
                    href={`${origin}/${originalMessage.slug}`}
                    className="mt-6 mb-2 rounded-lg bg-blue-200 px-4 py-2 text-sm font-bold text-black no-underline"
                  >
                    View
                  </Button>
                  <Hr className="my-4" />
                </Section>
              ))}
            {messages.length > MAX_MESSAGES_TO_SHOW && (
              <Section>
                <Text className="text-sm text-gray-500">
                  And {messages.length - MAX_MESSAGES_TO_SHOW} more replies...
                </Text>
                <Button
                  href={`${origin}`}
                  className="rounded-lg bg-blue-200 px-4 py-2 text-sm font-bold text-black no-underline"
                >
                  View All
                </Button>
              </Section>
            )}
            <Section className="text-center">
              <Link
                href={`${origin}/unsubscribe?userId=${userId}&type=${notificationType}`}
                className="text-sm text-red-500 no-underline"
              >
                Turn off reply notifications
              </Link>
            </Section>
          </Body>
        </Tailwind>
      </Html>,
    ),
  );
}

const Message = ({ message }: { message: EnhancedMessage }) => {
  return (
    <Section>
      <div className="flex items-center">
        {message.pfp && (
          <Img
            src={message.pfp}
            alt={message.name}
            width={40}
            height={40}
            className="mr-4 rounded-full"
          />
        )}
        <Text className="text-sm font-bold">{message.username}</Text>
      </div>
      <MessageContent content={message.content} />
    </Section>
  );
};

const MessageContent = ({ content }: { content: string | null }) => {
  if (content === null) return <Text className="italic">Deleted message</Text>;

  const maxChars = 1000;
  const trimmedContent =
    content.length > maxChars ? content.slice(0, maxChars) + "..." : content;

  return <Text>{trimmedContent}</Text>;
};
