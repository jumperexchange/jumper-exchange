export const formatDate = (dateString: string | Date) => {
  return new Date(dateString).toLocaleDateString('en-us', {
    day: 'numeric',
    year: 'numeric',
    month: 'short',
  });
};

export const formatDateShort = (dateStr: string) => {
  const date = new Date(dateStr);

  // Get the month abbreviation and day
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};
