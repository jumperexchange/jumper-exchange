import { usePathname } from 'next/navigation';
import { usePartnerTheme } from './usePartnerTheme';

interface useMainPathsProps {
  isMainPaths: boolean;
}

export const useMainPaths = (): useMainPathsProps => {
  const pathname = usePathname();
  const { hasTheme } = usePartnerTheme();

  const isGas = pathname?.includes('/gas');
  const isBuy = pathname?.includes('/buy');
  //Todo: find better way to check
  const isExchange =
    !pathname?.includes('/profile') &&
    !pathname?.includes('/learn') &&
    (pathname === '/' ||
      pathname?.split('/').length === 3 ||
      pathname?.split('/').length === 2);

  return {
    isMainPaths: !hasTheme && (isGas || isBuy || isExchange),
  };
};
