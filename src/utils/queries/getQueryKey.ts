export const getQueryKey = (key: string, prefix?: string) =>
  `${prefix || 'jumper'}-${key}`;
