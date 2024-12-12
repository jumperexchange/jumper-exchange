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
    label: 'Minutes',
    multiplier: 60,
  },
  hours: {
    offer: 2,
    notation: 'hr',
    label: 'Hours',
    multiplier: 3600,
  },
  days: {
    offer: 3,
    notation: 'd',
    label: 'Days',
    multiplier: 86400,
  },
  weeks: {
    offer: 4,
    notation: 'wk',
    label: 'Weeks',
    multiplier: 604800,
  },
  months: {
    offer: 5,
    notation: 'mo',
    label: 'Months',
    multiplier: 2592000,
  },
  years: {
    offer: 6,
    notation: 'yr',
    label: 'Years',
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
