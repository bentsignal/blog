import {
  MAX_MESSAGE_LENGTH,
  MIN_MESSAGE_LENGTH,
} from "@/config/message-config";
import { Snapshot } from "@/types/message-types";

export const validateMessage = (content: string) => {
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
export const getMessageContent = (snapshots: Snapshot[]) => {
  if (snapshots.length === 0) return null;
  return snapshots[snapshots.length - 1].content;
};
