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
  let hasTheme = false;
  let isBridgeFiltered = false;
  let isDexFiltered = false;
  let partnerName = '';
  let backgroundURL = '';

  // check the list of bridge that we suport the name that we use
  const { isLoading, bridgesKeys, exchangesKeys } = useDexsAndBridgesKeys();

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

  const pathnameSplit = pathname.split('/');
  const pathnameKey = pathnameSplit[pathnameSplit.length - 2].toLowerCase();
  if (bridgesKeys && bridgesKeys.includes(pathnameKey)) {
    hasTheme = true;
    isBridgeFiltered = true;
    partnerName = pathnameKey;
  } else if (exchangesKeys && exchangesKeys.includes(pathnameKey)) {
    hasTheme = true;
    isDexFiltered = true;
    partnerName = pathnameKey;
  }

  if (hasTheme) {
    // check Strapi hook for the background URL;
    backgroundURL =
      'https://strapi.li.finance/uploads/meme_background_dfed12edfe.jpeg';
  }

  return {
    hasTheme,
    isBridgeFiltered,
    isDexFiltered,
    partnerName,
    backgroundURL,
  };
};
