/** Chain-scoped token identifier: `{chainId}:{addressLower}` (e.g. `42161:0xabc…`). */
export function composeTokenKey(chainId: number, address: string): string {
  return `${chainId}:${address.toLowerCase()}`;
}
