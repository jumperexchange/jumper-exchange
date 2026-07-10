import { AppPaths } from '@/const/urls';
import { usePathnameWithoutLocale } from './routing/usePathnameWithoutLocale';

interface useMainPathsProps {
  isMainPaths: boolean;
  isExchange: boolean;
}

export const useMainPaths = (): useMainPathsProps => {
  const pathname = usePathnameWithoutLocale();

  const matchesPath = (route: AppPaths) =>
    pathname === route || pathname?.startsWith(`${route}/`);

  const isGas = matchesPath(AppPaths.Gas);
  const isBuy = matchesPath(AppPaths.Buy);
  const isPrivate = matchesPath(AppPaths.Private);
  const isAdvanced = matchesPath(AppPaths.Advanced);
  const isExchange = pathname === AppPaths.Main;

  return {
    isMainPaths: isGas || isBuy || isPrivate || isExchange || isAdvanced,
    isExchange,
  };
};
