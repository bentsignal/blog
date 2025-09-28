import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimestamp = (time: number) => {
  const date = new Date(time);
  const now = new Date();

  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  // Within the last 24 hours
  if (diffInHours < 24) {
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes} ${date.getHours() < 12 ? "AM" : "PM"}`;
  }

  // Yesterday
  if (diffInDays === 1) {
    return "yesterday";
  }

  // Days ago (2-6 days)
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  }

  // Weeks ago (1-4 weeks)
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks === 1 ? "" : "s"} ago`;
  }

  // Months ago (1-11 months)
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? "" : "s"} ago`;
  }

  // Years ago
  return `${diffInYears} year${diffInYears === 1 ? "" : "s"} ago`;
};

export const getProfileUrl = (username: string) => {
  return `https://www.github.com/${username}`;
};
