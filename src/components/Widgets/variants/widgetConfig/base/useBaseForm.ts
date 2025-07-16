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
    const partialConfig: Partial<WidgetConfig> = {};

    if (sourceChain?.chainId) {
      partialConfig.fromChain = Number(sourceChain.chainId);
    }

    if (sourceToken?.tokenAddress) {
      partialConfig.fromToken = sourceToken.tokenAddress;
    }

    if (destinationChain?.chainId) {
      partialConfig.toChain = Number(destinationChain.chainId);
    }

    if (destinationToken?.tokenAddress) {
      partialConfig.toToken = destinationToken.tokenAddress;
    }

    if (toAddress) {
      partialConfig.toAddress = {
        address: toAddress.walletAddress,
        chainType: (toAddress.chainType as ChainType) ?? ChainType.EVM,
      };
    }

    if (fromAmount) {
      partialConfig.fromAmount = fromAmount;
    }

    // if (missionChainIds) {
    //   partialConfig.chains = {
    //     from: {
    //       allow: missionChainIds,
    //     },
    //     to: {
    //       allow: missionChainIds,
    //     },
    //   };
    // }

    return partialConfig;
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
