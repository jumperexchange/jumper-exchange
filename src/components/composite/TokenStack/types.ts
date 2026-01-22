export interface TokenStackToken {
  address: string;
  logoURI?: string;
  name?: string;
  symbol?: string;
  chain: {
    chainId: number;
    chainKey: string;
  };
}
