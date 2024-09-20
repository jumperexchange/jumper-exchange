export interface WidgetCacheProps {
  fromToken: string;
  fromChainId: number;
  toToken: string;
  toChainId: number;
}
export interface WidgetCacheState extends WidgetCacheProps {
  setFromToken: (token: string) => void;
  setFromChainId: (chainId: number) => void;
  setFrom(token: string, chainId: number): void;
  setToToken: (token: string) => void;
  setToChainId: (chainId: number) => void;
  setTo(token: string, chainId: number): void;
}
