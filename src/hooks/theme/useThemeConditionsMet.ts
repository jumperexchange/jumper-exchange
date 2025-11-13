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

  const sourceChainId = sourceChainToken.chainId ?? widgetCache.fromChainId;

  const destinationChainId =
    destinationChainToken.chainId ?? widgetCache.toChainId;

  useEffect(() => {
    setShouldShowForChain(
      sourceChainId === configTheme.showForFromChain ||
        destinationChainId === configTheme.showForToChain,
    );
  }, [
    sourceChainId,
    destinationChainId,
    configTheme.showForFromChain,
    configTheme.showForToChain,
  ]);

  const shouldShowForPath = pathname === AppPaths.Main;
  return shouldShowForChain && shouldShowForPath;
};
