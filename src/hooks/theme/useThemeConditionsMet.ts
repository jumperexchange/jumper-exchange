import { usePathname } from 'next/navigation';
import { parseAsInteger, useQueryStates } from 'nuqs';
import { useEffect, useState } from 'react';
import { AppPaths } from 'src/const/urls';
import { useChainTokenSelectionStore } from 'src/stores/chainTokenSelection';
import { useThemeStore } from 'src/stores/theme';
import { useWidgetCacheStore } from 'src/stores/widgetCache';

export const useThemeConditionsMet = () => {
  const [shouldShowForChain, setShouldShowForChain] = useState<boolean>(false);
  const pathname = usePathname();
  const configTheme = useThemeStore((state) => state.configTheme);
  const [queryParams] = useQueryStates({
    fromChain: parseAsInteger,
    toChain: parseAsInteger,
  });
  const widgetCache = useWidgetCacheStore((state) => state);
  const { sourceChainToken, destinationChainToken } =
    useChainTokenSelectionStore();

  // Use widget cache - set through the wallet menu
  useEffect(() => {
    setShouldShowForChain(
      widgetCache?.fromChainId === configTheme.showForFromChain ||
        widgetCache?.toChainId === configTheme.showForToChain,
    );
  }, [widgetCache]);

  // Use chain selection store reacting to widget events
  useEffect(() => {
    setShouldShowForChain(
      sourceChainToken?.chainId === configTheme.showForFromChain ||
        destinationChainToken?.chainId === configTheme.showForToChain,
    );
  }, [sourceChainToken, destinationChainToken]);

  // Use query params updated through link clicks as the announcement links
  useEffect(() => {
    setShouldShowForChain(
      queryParams?.fromChain === configTheme.showForFromChain ||
        queryParams?.toChain === configTheme.showForToChain,
    );
  }, [queryParams]);

  const shouldShowForPath = pathname === AppPaths.Main;
  return shouldShowForChain && shouldShowForPath;
};
