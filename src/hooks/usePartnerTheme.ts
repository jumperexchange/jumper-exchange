import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useDexsAndBridgesKeys } from './useDexsAndBridgesKeys';

interface usePartnerThemeProps {
  hasTheme: boolean;
  isBridgeFiltered: boolean;
  isDexFiltered: boolean;
  partnerName: string;
  backgroundURL?: string;
}

export const usePartnerTheme = (): usePartnerThemeProps => {
  const pathname = usePathname();
  // check the list of bridge that we suport the name that we use
  const { isLoading, bridgesKeys, exchangesKeys } = useDexsAndBridgesKeys();

  const pathnameSplit = pathname.split('/');
  console.log(pathnameSplit);
  const pathnameKey = pathnameSplit[pathnameSplit.length - 2].toLowerCase();
  let hasTheme = false;
  let isBridgeFiltered = false;
  let isDexFiltered = false;
  let partnerName = '';

  if (pathname?.includes('memecoins')) {
    hasTheme = true;
    partnerName = 'memecoins';
  } else if (bridgesKeys && bridgesKeys.includes(pathnameKey)) {
    hasTheme = true;
    isBridgeFiltered = true;
    partnerName = pathnameKey;
  } else if (exchangesKeys && exchangesKeys.includes(pathnameKey)) {
    hasTheme = true;
    isDexFiltered = true;
    partnerName = pathnameKey;
  }

  console.log('in usepartnertheme');
  console.log(partnerName);

  return {
    hasTheme,
    isBridgeFiltered,
    isDexFiltered,
    partnerName,
  };
};
