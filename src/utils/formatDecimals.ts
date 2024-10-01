export function formatDecimal(number: number) {
  return Number.isInteger(number)
    ? number
    : number.toFixed(2).replace(/\.?0+$/, '');
}
