export interface TokenStackToken {
  address: string;
  logoURI?: string | null;
  name?: string;
  symbol?: string;
  chain: {
    chainId: number;
    chainKey: string;
  };
}
