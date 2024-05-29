export const sliceStrToXChar = (s: string, len: number): string => {
  return s.length < len ? s : s.slice(0, len - 3) + '...';
};
