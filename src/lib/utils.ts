import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

export const isOverOneDayAgo = (time: number) => {
  const date = new Date(time);
  const now = new Date();
  return now.getTime() - date.getTime() > 1000 * 60 * 60 * 24;
};

export const getDateString = (time: number) => {
  const date = new Date(time);
  return date.toLocaleDateString(undefined, {
    year: "2-digit",
    month: "numeric",
    day: "numeric",
  });
};

export const getTimeString = (time: number) => {
  const date = new Date(time);
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const getFullTimestamp = (time: number) => {
  if (isOverOneDayAgo(time)) {
    return `${getDateString(time)}, ${getTimeString(time)}`;
  }
  return getTimeString(time);
};

export const getProfileUrl = (username: string) => {
  return `https://www.github.com/${username}`;
};
