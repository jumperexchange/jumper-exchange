export const stringLenShortener = (s: string, len: number): string => {
  return s?.length > len ? `${s.slice(0, len)}...` : s;
};
