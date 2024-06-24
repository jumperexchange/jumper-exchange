import { usePathname } from 'next/navigation';
import { useDexsAndBridgesKeys } from './useDexsAndBridgesKeys';

interface usePartnerThemeProps {
  hasTheme: boolean;
  isBridgeFiltered: boolean;
  isDexFiltered: boolean;
  partnerName: string;
}

export const usePartnerTheme = (): usePartnerThemeProps => {
  const pathname = usePathname();
  let hasTheme = false;
  let isBridgeFiltered = false;
  let isDexFiltered = false;
  let partnerName = '';

  // check the list of bridge that we suport the name that we use
  const { bridgesKeys, exchangesKeys } = useDexsAndBridgesKeys();

  if (pathname?.includes('memecoins')) {
    hasTheme = true;
    partnerName = 'memecoins';
    return {
      hasTheme,
      isBridgeFiltered,
      isDexFiltered,
      partnerName,
    };
  }

  const pathnameSplit = pathname && pathname.split('/');
  const pathnameKey =
    pathnameSplit && pathnameSplit[pathnameSplit.length - 2].toLowerCase();
  if (pathnameKey) {
    if (bridgesKeys && bridgesKeys.includes(pathnameKey)) {
      hasTheme = true;
      isBridgeFiltered = true;
      partnerName = pathnameKey;
    } else if (exchangesKeys && exchangesKeys.includes(pathnameKey)) {
      hasTheme = true;
      isDexFiltered = true;
      partnerName = pathnameKey;
    }
  }

  return {
    hasTheme,
    isBridgeFiltered,
    isDexFiltered,
    partnerName,
  };
};
