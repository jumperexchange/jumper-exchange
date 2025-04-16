export function formatInputAmount(
  amount: string,
  decimals: number | null = null,
  returnInitial: boolean = false,
) {
  const parsedAmount = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'standard',
    useGrouping: true,
  }).format(parseFloat(amount) ?? 0);

  return parsedAmount;
}
