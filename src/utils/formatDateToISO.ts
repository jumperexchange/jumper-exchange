/**
 * file contains code for setting a date in the ISO 8601 format (YYYY-MM-DD)
 */
export const formatDateToISO = (inputDate: string): string => {
  const date = new Date(inputDate); // Create a Date object from the input date string

  // Extract year, month, and day components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  // Construct the formatted date string
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
};
