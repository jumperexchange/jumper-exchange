import { useMemo } from 'react';
import { isBefore } from 'date-fns';
import { AppPaths } from 'src/const/urls';
import { useThemeStore } from 'src/stores/theme';
import { useWidgetCacheStore } from 'src/stores/widgetCache';
import { usePathnameWithoutLocale } from '../routing/usePathnameWithoutLocale';

const ALLOWED_PATHS = [AppPaths.Main, AppPaths.Gas];

export const useThemeConditionsMet = () => {
  const pathname = usePathnameWithoutLocale();
  const [configTheme, configThemeStates] = useThemeStore((state) => [
    state.configTheme,
    state.configThemeStates,
  ]);
  const [fromChainId, toChainId] = useWidgetCacheStore((state) => [
    state.fromChainId,
    state.toChainId,
  ]);

  const activeConfigThemeState = useMemo(() => {
    const entry = Object.entries(configThemeStates).find(
      ([uid]) => uid === configTheme?.uid,
    );
    return entry?.[1];
  }, [configThemeStates, configTheme]);

  const shouldShowForTheme = useMemo(() => {
    if (!activeConfigThemeState?.isSelected) {
      return false;
    }

    if (!activeConfigThemeState.expirationDate) {
      return false;
    }

    return isBefore(new Date(), activeConfigThemeState.expirationDate);
  }, [activeConfigThemeState]);

  const shouldShowForChain = useMemo(() => {
    const { showForFromChain, showForToChain } = configTheme || {};

    if (!showForFromChain && !showForToChain) {
      return true;
    }

    return fromChainId === showForFromChain || toChainId === showForToChain;
  }, [fromChainId, toChainId, configTheme]);

  const shouldShowForPath = ALLOWED_PATHS.includes(pathname as AppPaths);

  return {
    shouldShowForTheme,
    shouldShowForChain,
    shouldShowForPath,
  };
};
