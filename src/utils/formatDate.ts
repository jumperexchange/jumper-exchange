export const formatMonthDayDateShort = (dateStr: string) => {
  const date = new Date(dateStr);

  // Get the month abbreviation and day
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export const dateFormatter = (
  lng: string | undefined,
  options: Intl.DateTimeFormatOptions,
) => {
  const formatter = new Intl.DateTimeFormat(lng, {
    ...options,
    day: 'numeric',
    year: 'numeric',
  });

  return (value: any) => {
    if (!value) {
      return '';
    }

    return formatter.format(value);
  };
};
