import { format } from 'date-fns';

/**
 * Formats a date with localized pattern and ensures days are zero-padded.
 * Uses date-fns format tokens for localization while guaranteeing consistent day padding.
 *
 * @param date - The date to format (Date object, timestamp, or ISO string)
 * @param formatString - date-fns format string (e.g., 'PP', 'PP p')
 * @returns Formatted date string with zero-padded days
 *
 * @example
 * formatDateLocalized(new Date('2025-10-03'), 'PP')
 * // English: "Oct 03, 2025"
 * // French: "03 oct. 2025"
 * // German: "03.10.2025"
 */
export const formatDateLocalized = (
  date: Date | number | string,
  formatString: string,
): string => {
  const formattedDate = format(date, formatString);

  // Replace single-digit days with zero-padded equivalents
  // This regex matches:
  // - Space or start of string, followed by single digit, followed by space or punctuation
  // - Handles formats like: "Oct 3, 2025" → "Oct 03, 2025"
  //                         "3 oct. 2025" → "03 oct. 2025"
  //                         "3.10.2025" → "03.10.2025"
  return formattedDate.replace(/(\s|^)(\d)(\s|[.,])/g, '$10$2$3');
};
