import { ChainType } from '@lifi/sdk';
import { useMemo } from 'react';
import { useChainTokenSelectionStore } from 'src/stores/chainTokenSelection';
import { useChains } from './useChains';
import { useUrlParams } from './useUrlParams';

export const useTokenSelection = () => {
  const { getChainById } = useChains();

  const {
    sourceChainToken: sourceChainTokenParam,
    destinationChainToken: destinationChainTokenParam,
    toAddress,
  } = useUrlParams();
  const {
    sourceChainToken: sourceChainTokenSelected,
    destinationChainToken: destionationChainTokenSelected,
  } = useChainTokenSelectionStore();

  const sourceChainToken = useMemo(() => {
    return sourceChainTokenSelected || sourceChainTokenParam;
  }, [sourceChainTokenSelected, sourceChainTokenParam]);
  const destinationChainToken = useMemo(() => {
    return destionationChainTokenSelected || destinationChainTokenParam;
  }, [destionationChainTokenSelected, destinationChainTokenParam]);

  const isEvmSourceChain =
    sourceChainToken?.chainId &&
    getChainById(sourceChainToken.chainId)?.chainType === ChainType.EVM;
  const isEvmDestinationChain =
    destinationChainToken?.chainId &&
    getChainById(destinationChainToken.chainId)?.chainType === ChainType.EVM;

  return {
    sourceChainToken: { ...sourceChainToken, isEvm: isEvmSourceChain },
    destinationChainToken: {
      ...destinationChainToken,
      isEvm: isEvmDestinationChain,
    },
    toAddress,
  };
};
