export function formatDecimal(number: number) {
  if (!number) {
    return;
  }
  return Number.isInteger(number)
    ? number
    : number.toFixed(2).replace(/\.?0+$/, '');
}
