export type OrderStatus =
  | 'pending'
  | 'active'
  | 'partially_filled'
  | 'filled'
  | 'cancelled'
  | 'expired';

export interface LimitOrderToken {
  address: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
  priceUSD?: string;
}

export interface LimitOrder {
  id: string;
  protocol: '1inch' | 'cowswap';
  chainId: number;
  fromToken: LimitOrderToken;
  toToken: LimitOrderToken;
  sellAmount: string;
  buyAmount: string;
  limitPrice: string;
  marketPrice?: string;
  filledPercent: number;
  status: OrderStatus;
  expiresAt?: string;
  createdAt: string;
}
