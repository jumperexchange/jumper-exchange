import { ChainType } from '@lifi/sdk';
import { WidgetConfig } from '@lifi/widget';
import { useMemo } from 'react';
import { ConfigContext } from '../types';

export const useBaseForm = (ctx: ConfigContext) => {
  const {
    destinationChain,
    destinationToken,
    sourceChain,
    sourceToken,
    fromAmount,
    toAddress,
    // missionChainIds,
  } = ctx;

  const config: Partial<WidgetConfig> = useMemo(() => {
    return {
      fromChain: sourceChain?.chainId
        ? Number(sourceChain?.chainId)
        : undefined,
      fromToken: sourceToken?.tokenAddress,
      toChain: destinationChain?.chainId
        ? Number(destinationChain?.chainId)
        : undefined,
      toToken: destinationToken?.tokenAddress,
      toAddress: toAddress
        ? {
            address: toAddress.walletAddress,
            chainType: (toAddress.chainType as ChainType) ?? ChainType.EVM,
          }
        : undefined,
      fromAmount,
      // chains: {
      //   from: {
      //     allow: missionChainIds,
      //   },
      //   to: {
      //     allow: missionChainIds,
      //   },
      // },
    };
  }, [
    destinationChain?.chainId,
    destinationToken?.tokenAddress,
    sourceChain?.chainId,
    sourceToken?.tokenAddress,
    fromAmount,
    toAddress?.walletAddress,
    // missionChainIds,
  ]);

  return config;
};
