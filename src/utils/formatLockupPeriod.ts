import { formatDuration, intervalToDuration } from 'date-fns';

/**
 * Formats a lockup period in seconds to a human-readable format
 * @param seconds - The lockup period in seconds
 * @returns Object with formatted value and unit
 */
export const formatLockupPeriod = (seconds: number) => {
  if (!seconds || seconds <= 0) {
    return { value: '0', unit: 'days' };
  }

  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });

  // Determine the best unit to display based on the duration
  if (duration.years && duration.years >= 1) {
    return {
      value: duration.years.toString(),
      unit: duration.years === 1 ? 'year' : 'years',
    };
  }

  if (duration.months && duration.months >= 1) {
    return {
      value: duration.months.toString(),
      unit: duration.months === 1 ? 'month' : 'months',
    };
  }

  if (duration.days && duration.days >= 1) {
    return {
      value: duration.days.toString(),
      unit: duration.days === 1 ? 'day' : 'days',
    };
  }

  if (duration.hours && duration.hours >= 1) {
    return {
      value: duration.hours.toString(),
      unit: duration.hours === 1 ? 'hour' : 'hours',
    };
  }

  // Fallback to minutes if less than an hour
  const minutes = Math.floor(seconds / 60);
  return {
    value: minutes.toString(),
    unit: minutes === 1 ? 'minute' : 'minutes',
  };
};
