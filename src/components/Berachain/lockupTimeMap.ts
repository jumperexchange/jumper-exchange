export const LockupTimeMap: Record<
  string,
  {
    offer: number;
    notation: string;
    label: string;
    multiplier: number;
  }
> = {
  minutes: {
    offer: 1,
    notation: 'min',
    label: 'minutes',
    multiplier: 60,
  },
  hours: {
    offer: 2,
    notation: 'hr',
    label: 'hours',
    multiplier: 3600,
  },
  days: {
    offer: 3,
    notation: 'd',
    label: 'days',
    multiplier: 86400,
  },
  weeks: {
    offer: 4,
    notation: 'wk',
    label: 'weeks',
    multiplier: 604800,
  },
  months: {
    offer: 5,
    notation: 'mo',
    label: 'months',
    multiplier: 2592000,
  },
  years: {
    offer: 6,
    notation: 'yr',
    label: 'years',
    multiplier: 31536000,
  },
};

export function secondsToDuration(seconds: any) {
  const years = Math.floor(seconds / (365 * 24 * 60 * 60));
  seconds %= 365 * 24 * 60 * 60;
  const months = Math.floor(seconds / (30 * 24 * 60 * 60));
  seconds %= 30 * 24 * 60 * 60;
  const days = Math.floor(seconds / (24 * 60 * 60));
  seconds %= 24 * 60 * 60;
  const hours = Math.floor(seconds / (60 * 60));
  seconds %= 60 * 60;
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
  };
}

export function formatWithCustomLabels(duration: Record<string, number>) {
  return Object.entries(duration)
    .filter(([_, value]) => value > 0) // Filter out zero values
    .slice(0, 2) // Take the first two non-zero units
    .map(([unit, value]) => {
      const notation = `${LockupTimeMap[unit]?.notation || unit}${value > 1 && 's'}`; // Get notation or fallback to original unit
      return `${value} ${notation}`; // Format as "X mins", "Y hrs", etc.
    })
    .join(' '); // Combine into a single string
}
