export const isValidHeadingLevel = (
  level: number,
): level is 1 | 2 | 3 | 4 | 5 | 6 => {
  return level >= 1 && level <= 6;
};
