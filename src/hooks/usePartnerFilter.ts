'use client';

import { usePathname } from 'next/navigation';
import { useDexsAndBridgesKeys } from './useDexsAndBridgesKeys';

interface usePartnerFilterProps {
  hasTheme: boolean;
  isBridgeFiltered: boolean;
  isDexFiltered: boolean;
  partnerName?: string;
  bridgesKeys: string[];
  exchangesKeys: string[];
}

export const usePartnerFilter = (): usePartnerFilterProps => {
  const pathname = usePathname();
  // check the list of bridge that we suport the name that we use
  const { bridgesKeys, exchangesKeys } = useDexsAndBridgesKeys();

  // check the list of bridge that we suport the name that we use
  let hasTheme = false;
  let isBridgeFiltered = false;
  let isDexFiltered = false;
  let partnerName;
  const pathnameSplit = pathname?.split('/').filter((el) => el !== '');
  const localeSplit =
    pathnameSplit && pathnameSplit.length > 1 && pathnameSplit[0];
  if (localeSplit && localeSplit.length === 2) {
    partnerName =
      pathnameSplit && pathnameSplit[pathnameSplit.length - 1]?.toLowerCase();
  } else {
    partnerName = pathnameSplit && pathnameSplit[0]?.toLowerCase();
  }
  console.log('partnerName', partnerName);

  if (pathname?.includes('memecoins')) {
    hasTheme = true;
    partnerName = 'memecoins';
    return {
      hasTheme,
      isBridgeFiltered,
      isDexFiltered,
      partnerName,
      exchangesKeys,
      bridgesKeys,
    };
  }

  return {
    hasTheme: partnerName ? true : false,
    partnerName,
    isBridgeFiltered,
    isDexFiltered,
    bridgesKeys,
    exchangesKeys,
  };
};
