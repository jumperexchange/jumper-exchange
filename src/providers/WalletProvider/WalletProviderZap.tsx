'use client';
import { type FC, type PropsWithChildren, useEffect } from 'react';
import { useSdkConfigStore } from 'src/stores/sdkConfig/SDKConfigStore';

export const WalletProviderZap: FC<PropsWithChildren> = ({ children }) => {
  const { setConfigType } = useSdkConfigStore();
  useEffect(() => {
    setConfigType('zap');
  }, []);

  // @Note the WalletProvider will already wrap children with the
  // EVMProvider, UTXOProvider, SVMProvider and SuiProvider
  return children;
};
