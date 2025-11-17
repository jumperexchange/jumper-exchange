export const isZeroApprox = (x: number) => Math.abs(x) < Number.EPSILON;

export const parseNumber = (value: string | null | undefined) => {
  if (!value) {
    return undefined;
  }
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
};
