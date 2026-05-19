import { shuffle } from 'lodash';
import { getMergedRPCList } from 'src/const/rpcList';

export const getShuffledRPCForChain = (chainId: string | number) => {
  const rpcUrls = getMergedRPCList()[chainId];
  if (!rpcUrls?.length) {
    return;
  }

  return shuffle([...rpcUrls])[0];
};
