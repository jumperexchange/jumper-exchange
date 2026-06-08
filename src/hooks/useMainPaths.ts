import { AppPaths } from '@/const/urls';
import { usePathnameWithoutLocale } from './routing/usePathnameWithoutLocale';

interface useMainPathsProps {
  isMainPaths: boolean;
}

export const useMainPaths = (): useMainPathsProps => {
  const pathname = usePathnameWithoutLocale();

  const isGas = pathname?.includes(AppPaths.Gas);
  const isBuy = pathname?.includes(AppPaths.Buy);
  const isPrivate = pathname?.includes(AppPaths.Private);
  const isExchange = pathname === AppPaths.Main;

  return {
    isMainPaths: isGas || isBuy || isPrivate || isExchange,
  };
};
