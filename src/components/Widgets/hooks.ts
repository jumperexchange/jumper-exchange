import { useMemo } from 'react';
import { useThemeStore } from '@/stores/theme';
import { useWidgetCacheStore } from '@/stores/widgetCache';

interface UseFormParametersProps {
  fromChain?: number;
  fromToken?: string;
  toChain?: number;
  toToken?: string;
  fromAmount?: string;
}

export const useFormParameters = ({
  fromChain,
  fromToken,
  toChain,
  toToken,
  fromAmount,
}: UseFormParametersProps) => {
  const configTheme = useThemeStore((state) => state.configTheme);
  const widgetCache = useWidgetCacheStore((state) => state);

  const formParametersCtx = useMemo(() => {
    const params: Record<
      string,
      | number
      | string
      | { chainId: string | number | undefined }
      | { tokenAddress: string | number | undefined }
      | undefined
    > = {};

    const sourceChainId =
      configTheme?.fromChain ?? fromChain ?? widgetCache.fromChainId;

    const sourceTokenAddress =
      configTheme?.fromToken ?? fromToken ?? widgetCache.fromToken;

    const destinationChainId =
      configTheme?.toChain ?? toChain ?? widgetCache.toChainId;

    const destinationTokenAddress =
      configTheme?.toToken ?? toToken ?? widgetCache.toToken;

    const amount = fromAmount;

    if (sourceChainId) {
      params.sourceChain = { chainId: sourceChainId };
    }
    if (sourceTokenAddress) {
      params.sourceToken = { tokenAddress: sourceTokenAddress };
    }
    if (destinationChainId) {
      params.destinationChain = { chainId: destinationChainId };
    }
    if (destinationTokenAddress) {
      params.destinationToken = { tokenAddress: destinationTokenAddress };
    }
    if (amount) {
      params.fromAmount = amount;
    }

    return params;
  }, [
    configTheme?.fromChain,
    configTheme?.fromToken,
    configTheme?.toChain,
    configTheme?.toToken,
    fromAmount,
    fromChain,
    fromToken,
    toChain,
    toToken,
    widgetCache.fromChainId,
    widgetCache.fromToken,
    widgetCache.toChainId,
    widgetCache.toToken,
  ]);

  return formParametersCtx;
};
