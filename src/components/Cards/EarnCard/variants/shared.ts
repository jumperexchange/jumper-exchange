/**
 * Returns the data with at least minN elements and at most maxN elements, fill with null when loading.
 */
export const AtLeastNWhenLoading = <T>(
  data: T[] | undefined | null,
  isLoading: boolean,
  minN: number,
  maxN?: number,
): (T | null)[] => {
  maxN = maxN ?? minN;
  const d: T[] = data ?? [];
  const missingN = minN - d.length;
  const filler: null[] = isLoading ? Array(missingN).fill(null) : [];
  const result = [...d, ...filler].slice(0, maxN);
  return result;
};

export const formatLockupDuration = (lockupMonths: number) => {
  const duration = lockupMonths.toLocaleString();

  if (lockupMonths === 0) {
    return 'None';
  } else if (lockupMonths <= 1) {
    return `${duration} month`;
  }
  return `${duration} months`;
};
