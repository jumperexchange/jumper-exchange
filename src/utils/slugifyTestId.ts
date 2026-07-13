export const slugifyTestId = (value: string): string =>
  value.toLowerCase().replace(/\s+/g, '-');
