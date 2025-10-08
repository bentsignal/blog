import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MAX_MESSAGE_LENGTH, MIN_MESSAGE_LENGTH } from "./config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Success<T> = {
  data: T;
  error: null;
};

type Failure<E> = {
  data: null;
  error: E;
};

export type Result<T, E = Error> = Success<T> | Failure<E>;

export async function tryCatch<T, E = Error>(
  promise: Promise<T>,
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as E };
  }
}

export const getProfileUrl = (username: string) => {
  return `https://www.github.com/${username}`;
};

export const validateMessage = (content: string) => {
  if (!content) return "Message cannot be empty";
  if (content.length > MAX_MESSAGE_LENGTH)
    return `Message must be less than ${MAX_MESSAGE_LENGTH} characters`;
  if (content.length < MIN_MESSAGE_LENGTH)
    return `Message must be at least ${MIN_MESSAGE_LENGTH} characters`;
  return "Valid";
};
