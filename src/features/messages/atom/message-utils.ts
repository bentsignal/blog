import { MAX_MESSAGE_LENGTH, MIN_MESSAGE_LENGTH } from "./message-config";
import {
  Reaction,
  REACTION_EMOJIS,
  ReactionEmoji,
  Snapshot,
} from "./message-types";

const validateMessage = (content: string) => {
  if (!content) return "Message cannot be empty";
  if (content.length > MAX_MESSAGE_LENGTH)
    return `Message must be less than ${MAX_MESSAGE_LENGTH} characters`;
  if (content.length < MIN_MESSAGE_LENGTH)
    return `Message must be at least ${MIN_MESSAGE_LENGTH} characters`;
  return "Valid";
};

/**
 * Get the latest version of a message
 * @param snapshots each snapshot represents the message at a given point in time
 * @returns the message content if it exists, or null if the message has been deleted
 */
const getMessageContent = (snapshots: Snapshot[]) => {
  if (snapshots.length === 0) return null;
  return snapshots[snapshots.length - 1].content;
};

const getReactionCounts = (reactions: Reaction[]) => {
  return reactions.reduce(
    (acc, reaction) => {
      acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
      return acc;
    },
    {} as Record<ReactionEmoji, number | undefined>,
  );
};

const getReactionsSignature = (reactions: Reaction[]) => {
  const reactionCounts = getReactionCounts(reactions);
  return REACTION_EMOJIS.map(
    (emoji) => `${emoji}-${reactionCounts[emoji] ?? 0}`,
  ).join("-");
};

export {
  validateMessage,
  getMessageContent,
  getReactionCounts,
  getReactionsSignature,
};
