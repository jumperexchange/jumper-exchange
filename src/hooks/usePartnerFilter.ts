'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useSettingsStore } from 'src/stores/settings';
import { useDexsAndBridgesKeys } from './useDexsAndBridgesKeys';

interface usePartnerFilterProps {
  hasTheme: boolean;
  isBridgeFiltered: boolean;
  isDexFiltered: boolean;
  partnerName: string;
  bridgesKeys: string[];
  exchangesKeys: string[];
}

export const usePartnerFilter = (): usePartnerFilterProps => {
  const pathname = usePathname();
  const setPartnerThemeUid = useSettingsStore(
    (state) => state.setPartnerThemeUid,
  );

  // check the list of bridge that we suport the name that we use
  const { bridgesKeys, exchangesKeys } = useDexsAndBridgesKeys();

  // check the list of bridge that we suport the name that we use
  let hasTheme = false;
  let isBridgeFiltered = false;
  let isDexFiltered = false;
  let partnerName = '';
  const pathnameSplit = pathname?.split('/');
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

  useEffect(() => {
    setPartnerThemeUid(partnerName);
  }, [setPartnerThemeUid, partnerName]);

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

  // console.log('set partner theme uid', partnerName);
  // setPartnerThemeUid(partnerName);

  return {
    hasTheme,
    isBridgeFiltered,
    isDexFiltered,
    partnerName,
    bridgesKeys,
    exchangesKeys,
  };
};
