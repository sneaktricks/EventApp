export const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  hour12: false,
});

export const numberFormat = new Intl.NumberFormat("en-US");

const relTimeFormat = new Intl.RelativeTimeFormat("en-US", {
  numeric: "auto",
  style: "long",
});

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

export const formatRelativeTime = (diff: number): string => {
  const absDiff: number = Math.abs(diff);

  if (absDiff >= 2 * YEAR) {
    return relTimeFormat.format(Math.trunc(diff / YEAR), "year");
  } else if (absDiff >= 2 * MONTH) {
    return relTimeFormat.format(Math.trunc(diff / MONTH), "month");
  } else if (absDiff >= 2 * WEEK) {
    return relTimeFormat.format(Math.trunc(diff / WEEK), "week");
  } else if (absDiff >= 2 * DAY) {
    return relTimeFormat.format(Math.trunc(diff / DAY), "day");
  } else if (absDiff >= 2 * HOUR) {
    return relTimeFormat.format(Math.trunc(diff / HOUR), "hour");
  } else if (absDiff >= 2 * MINUTE) {
    return relTimeFormat.format(Math.trunc(diff / MINUTE), "minute");
  } else {
    return relTimeFormat.format(Math.trunc(diff / SECOND), "second");
  }
};

export const formatDuration = (
  duration: number,
  maxDepth: 1 | 2 | 3 | 4
): string => {
  const absDuration = Math.abs(duration);

  const days = Math.trunc(duration / DAY);
  const hours = Math.trunc((duration % DAY) / HOUR);
  const minutes = Math.trunc(((duration % DAY) % HOUR) / MINUTE);
  const seconds = Math.trunc((((duration % DAY) % HOUR) % MINUTE) / SECOND);

  let depth = 0;
  const durationStrings: string[] = [];

  if (absDuration >= DAY) {
    durationStrings.push(`${days}d`);
    depth++;
  }

  if (absDuration >= HOUR && depth < maxDepth) {
    durationStrings.push(`${hours}h`);
    depth++;
  }

  if (absDuration >= MINUTE && depth < maxDepth) {
    durationStrings.push(`${minutes}m`);
    depth++;
  }

  if (depth < maxDepth) {
    durationStrings.push(`${seconds}s`);
  }

  return durationStrings.join(" ");
};
