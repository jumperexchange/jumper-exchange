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

  const sourceChainToken = sourceChainTokenSelected || sourceChainTokenParam;
  const destinationChainToken =
    destionationChainTokenSelected || destinationChainTokenParam;

  const isEvmSourceChain = useMemo(() => {
    sourceChainToken?.chainId &&
      getChainById(sourceChainToken.chainId)?.chainType === ChainType.EVM;
  }, [sourceChainToken]);
  const isEvmDestinationChain = useMemo(() => {
    return (
      destinationChainToken?.chainId &&
      getChainById(destinationChainToken.chainId)?.chainType === ChainType.EVM
    );
  }, [destinationChainToken]);

  return {
    sourceChainToken: { ...sourceChainToken, isEvm: isEvmSourceChain },
    destinationChainToken: {
      ...destinationChainToken,
      isEvm: isEvmDestinationChain,
    },
    toAddress,
  };
};
