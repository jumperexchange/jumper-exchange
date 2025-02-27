export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  if (!Array.isArray(array)) {
    return [];
  }
  const result: T[][] = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    result.push(chunk);
  }

  return result;
}
