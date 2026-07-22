import { useMemo, useRef } from 'react';
import type { NavigationTabKey } from '@jumperexchange/widget';
import { useThemeStore } from '@/stores/theme';
import { useWidgetCacheStore } from '@/stores/widgetCache';
import type { StarterVariantType } from '@/types/internal';
import type { FormData } from './variants/widgetConfig/types';
import {
  getUrlChainTokenParams,
  resolveWidgetPlaceholderTokens,
} from './variants/widgetConfig/utils';

interface UseFormParametersProps {
  fromChain?: number;
  fromToken?: string;
  toChain?: number;
  toToken?: string;
  fromAmount?: string;
  starterVariant?: StarterVariantType;
  activeTabKey?: NavigationTabKey | null;
}

const isEmptyPlaceholderSurface = (
  starterVariant?: StarterVariantType,
  activeTabKey?: NavigationTabKey | null,
) =>
  activeTabKey === 'refuel' ||
  activeTabKey === 'private' ||
  starterVariant === 'refuel' ||
  starterVariant === 'private';

/** WidgetEvents sometimes mirrors cleared fields as "". Treat those as unset. */
const nonemptyToken = (value?: string | null) =>
  value != null && value !== '' ? value : undefined;

type UrlChainTokenParams = ReturnType<typeof getUrlChainTokenParams>;

/**
 * Cold-load form seed only. Priority per field:
 * partner theme → props → session cache → URL → placeholders.
 * Private / Gas stay empty.
 *
 * URL is snapshotted once per mount so a sibling page's buildUrl cannot
 * re-pollute this instance mid-lifecycle (Simple ↔ Advanced dual mount).
 *
 * Tab switches apply pairs via `applyWidgetChainTokenFields` and stop feeding
 * chain/token through config (`seedChainTokensFromConfig` in Widget).
 */
export const useFormParameters = ({
  fromChain,
  fromToken,
  toChain,
  toToken,
  fromAmount,
  starterVariant,
  activeTabKey,
}: UseFormParametersProps): FormData => {
  const configTheme = useThemeStore((state) => state.configTheme);
  const widgetCache = useWidgetCacheStore((state) => state);
  const urlSnapshotRef = useRef<UrlChainTokenParams | null>(null);
  if (urlSnapshotRef.current === null) {
    urlSnapshotRef.current = getUrlChainTokenParams();
  }
  const url = urlSnapshotRef.current;

  return useMemo(() => {
    if (isEmptyPlaceholderSurface(starterVariant, activeTabKey)) {
      return {};
    }

    const placeholders =
      starterVariant !== undefined
        ? resolveWidgetPlaceholderTokens(starterVariant, activeTabKey)
        : undefined;

    const sourceChainId =
      configTheme?.fromChain ??
      fromChain ??
      widgetCache.fromChainId ??
      url.fromChain ??
      placeholders?.fromChain;

    const sourceTokenAddress =
      nonemptyToken(configTheme?.fromToken) ??
      nonemptyToken(fromToken) ??
      nonemptyToken(widgetCache.fromToken) ??
      nonemptyToken(url.fromToken) ??
      placeholders?.fromToken;

    const destinationChainId =
      configTheme?.toChain ??
      toChain ??
      widgetCache.toChainId ??
      url.toChain ??
      placeholders?.toChain;

    const destinationTokenAddress =
      nonemptyToken(configTheme?.toToken) ??
      nonemptyToken(toToken) ??
      nonemptyToken(widgetCache.toToken) ??
      nonemptyToken(url.toToken) ??
      placeholders?.toToken;

    const formData: FormData = {};

    if (sourceChainId != null) {
      formData.sourceChain = {
        chainId: String(sourceChainId),
        chainKey: '',
      };
    }
    if (sourceTokenAddress) {
      formData.sourceToken = {
        tokenAddress: sourceTokenAddress,
        tokenSymbol: '',
      };
    }
    if (destinationChainId != null) {
      formData.destinationChain = {
        chainId: String(destinationChainId),
        chainKey: '',
      };
    }
    if (destinationTokenAddress) {
      formData.destinationToken = {
        tokenAddress: destinationTokenAddress,
        tokenSymbol: '',
      };
    }
    if (fromAmount) {
      formData.fromAmount = fromAmount;
    }

    return formData;
  }, [
    activeTabKey,
    configTheme?.fromChain,
    configTheme?.fromToken,
    configTheme?.toChain,
    configTheme?.toToken,
    fromAmount,
    fromChain,
    fromToken,
    starterVariant,
    toChain,
    toToken,
    url.fromChain,
    url.fromToken,
    url.toChain,
    url.toToken,
    widgetCache.fromChainId,
    widgetCache.fromToken,
    widgetCache.toChainId,
    widgetCache.toToken,
  ]);
};
