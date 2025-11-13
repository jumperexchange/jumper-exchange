import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppPaths } from 'src/const/urls';
import { useThemeStore } from 'src/stores/theme';
import { useWidgetCacheStore } from 'src/stores/widgetCache';

export const useThemeConditionsMet = () => {
  const [shouldShowForChain, setShouldShowForChain] = useState<boolean>(false);
  const pathname = usePathname();
  const configTheme = useThemeStore((state) => state.configTheme);
  const [fromChainId, toChainId] = useWidgetCacheStore((state) => [
    state.fromChainId,
    state.toChainId,
  ]);

  useEffect(() => {
    if (!fromChainId || !toChainId) {
      return;
    }
    setShouldShowForChain(
      fromChainId === configTheme.showForFromChain ||
        toChainId === configTheme.showForToChain,
    );
  }, [
    fromChainId,
    toChainId,
    configTheme.showForFromChain,
    configTheme.showForToChain,
  ]);

  const shouldShowForPath = pathname === AppPaths.Main;
  return shouldShowForChain && shouldShowForPath;
};
