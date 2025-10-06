export const isOverOneDayAgo = (time: number) => {
  const date = new Date(time);
  const now = new Date();
  return now.getTime() - date.getTime() > 1000 * 60 * 60 * 24;
};

export const getNumericDateString = (time: number) => {
  const date = new Date(time);
  return date.toLocaleDateString(undefined, {
    year: "2-digit",
    month: "numeric",
    day: "numeric",
  });
};

export const getTextDateString = (time: number) => {
  const date = new Date(time);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
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
    return `${getNumericDateString(time)}, ${getTimeString(time)}`;
  }
  return getTimeString(time);
};

export const getProfileUrl = (username: string) => {
  return `https://www.github.com/${username}`;
};

export const areSameDay = (time1: number, time2: number) => {
  const date1 = new Date(time1);
  const date2 = new Date(time2);
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const isToday = (time: number) => {
  const date = new Date(time);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
};

export const isYesterday = (time: number) => {
  const date = new Date(time);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate() - 1
  );
};
