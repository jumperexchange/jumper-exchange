import { shuffle } from 'lodash';
import { mergedRPCList } from 'src/const/rpcList';

export const getShuffledRPCForChain = (chainId: string | number) => {
  const rpcUrls = mergedRPCList[chainId];
  if (!rpcUrls?.length) {
    return;
  }

  return shuffle([...rpcUrls])[0];
};
