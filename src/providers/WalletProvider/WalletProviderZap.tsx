'use client';
import { type FC, type PropsWithChildren, useEffect } from 'react';
import { EVMProvider } from './EVMProvider';
import { SVMProvider } from './SVMProvider';
import { UTXOProvider } from './UTXOProvider';
import { SuiProvider } from './SuiProvider';
import { useSdkConfigStore } from 'src/stores/sdkConfig';

export const WalletProviderZap: FC<PropsWithChildren> = ({ children }) => {
  const { setConfigType } = useSdkConfigStore();
  useEffect(() => {
    setConfigType('zap');
  }, []);

  return (
    <EVMProvider>
      <UTXOProvider>
        <SVMProvider>
          <SuiProvider>{children}</SuiProvider>
        </SVMProvider>
      </UTXOProvider>
    </EVMProvider>
  );
};
