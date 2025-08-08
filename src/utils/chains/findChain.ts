import { chains } from 'src/const/chains/chains';

export const findChain = (chainId: number) =>
  Object.values(chains).find((chain) => chain.id === chainId);
