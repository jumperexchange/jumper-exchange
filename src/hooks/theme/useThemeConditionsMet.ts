import { useEffect, useState } from 'react';
import { AppPaths } from 'src/const/urls';
import { useThemeStore } from 'src/stores/theme';
import { useWidgetCacheStore } from 'src/stores/widgetCache';
import { usePathnameWithoutLocale } from '../routing/usePathnameWithoutLocale';

export const useThemeConditionsMet = () => {
  const [shouldShowForChain, setShouldShowForChain] = useState<boolean>(false);
  const pathname = usePathnameWithoutLocale();
  const configTheme = useThemeStore((state) => state.configTheme);
  const [fromChainId, toChainId] = useWidgetCacheStore((state) => [
    state.fromChainId,
    state.toChainId,
  ]);

  useEffect(() => {
    const showForFromChain = configTheme?.showForFromChain;
    const showForToChain = configTheme?.showForToChain;

    if (!showForFromChain && !showForToChain) {
      setShouldShowForChain(true);
      return;
    }

    setShouldShowForChain(
      fromChainId === showForFromChain || toChainId === showForToChain,
    );
  }, [
    fromChainId,
    toChainId,
    configTheme.showForFromChain,
    configTheme.showForToChain,
  ]);

  const shouldShowForPath = [AppPaths.Main, AppPaths.Gas].includes(
    pathname as AppPaths,
  );
  return shouldShowForChain && shouldShowForPath;
};
