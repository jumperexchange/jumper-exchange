export const getQueryKey = (key: string, prefix?: string) =>
  `${prefix || 'li.fi'}-widget-${key}`;
