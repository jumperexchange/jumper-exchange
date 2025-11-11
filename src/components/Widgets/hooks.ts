import { useMemo } from 'react';
import { useThemeStore } from '@/stores/theme';
import { useWidgetCacheStore } from '@/stores/widgetCache';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';

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
  const [queryParams] = useQueryStates({
    fromChain: parseAsInteger,
    fromToken: parseAsString,
    toChain: parseAsInteger,
    toToken: parseAsString,
    fromAmount: parseAsString,
  });

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
      configTheme?.fromChain ??
      fromChain ??
      widgetCache.fromChainId ??
      queryParams.fromChain;

    const sourceTokenAddress =
      configTheme?.fromToken ??
      fromToken ??
      widgetCache.fromToken ??
      queryParams.fromToken;

    const destinationChainId =
      configTheme?.toChain ?? toChain ?? queryParams.toChain;

    const destinationTokenAddress =
      configTheme?.toToken ?? toToken ?? queryParams.toToken;

    const amount = fromAmount ?? queryParams.fromAmount;

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
    queryParams.toChain,
    queryParams.toToken,
    queryParams.fromChain,
    queryParams.fromToken,
    queryParams.fromAmount,
  ]);

  return formParametersCtx;
};
