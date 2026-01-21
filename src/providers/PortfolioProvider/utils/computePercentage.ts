export const computePercentage = (value: number, total: number): number => {
  return total > 0 ? (value / total) * 100 : 0;
};
