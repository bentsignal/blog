import {
  MAX_MESSAGE_LENGTH,
  MIN_MESSAGE_LENGTH,
} from "@/config/message-config";

export const validateMessage = (content: string) => {
  if (!content) return "Message cannot be empty";
  if (content.length > MAX_MESSAGE_LENGTH)
    return `Message must be less than ${MAX_MESSAGE_LENGTH} characters`;
  if (content.length < MIN_MESSAGE_LENGTH)
    return `Message must be at least ${MIN_MESSAGE_LENGTH} characters`;
  return "Valid";
};
