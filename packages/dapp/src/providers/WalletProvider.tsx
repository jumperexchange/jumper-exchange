import { useArcxAnalytics } from '@arcxmoney/analytics';
import { Token } from '@lifi/sdk';
import {
  addChain as walletAddChain,
  switchChain as walletSwitchChain,
  switchChainAndAddToken,
  useLiFiWalletManagement,
  Wallet,
} from '@lifi/wallet-management';
import { Signer } from 'ethers';
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  WalletAccount,
  WalletContextProps,
} from '@transferto/shared/src/types/wallet';
import { useMenu } from './MenuProvider';

const stub = (): never => {
  throw new Error('You forgot to wrap your component in <WalletProvider>.');
};

export const initialContext: WalletContextProps = {
  connect: stub,
  disconnect: stub,
  switchChain: stub,
  addChain: stub,
  addToken: stub,
  account: {},
};

const WalletContext = createContext<WalletContextProps>(initialContext);

export const useWallet = (): WalletContextProps =>
  React.useContext(WalletContext);

export const WalletProvider: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const {
    connect: walletManagementConnect,
    disconnect: walletManagementDisconnect,
    signer,
  } = useLiFiWalletManagement();
  const [account, setAccount] = useState<WalletAccount>({});
  const [usedWallet, setUsedWallet] = useState<Wallet | undefined>();
  const menu = useMenu();
  const arcx = useArcxAnalytics();
  const connect = useCallback(
    async (wallet?: Wallet) => {
      await walletManagementConnect(wallet);
      const account = await extractAccountFromSigner(signer);
      setUsedWallet(wallet!);
      setAccount(account);
      await arcx?.connectWallet({
        account: account.address,
        chain: account.chainId,
      });
    },
    [walletManagementConnect],
  );

  const disconnect = useCallback(async () => {
    setUsedWallet(undefined);
    await walletManagementDisconnect();
    menu.onCloseAllNavbarMenus();
  }, [walletManagementDisconnect]);

  // only for injected wallets
  const switchChain = useCallback(async (chainId: number) => {
    return walletSwitchChain(chainId);
  }, []);

  useEffect(() => {
    const arcxConnectWallet = async () => {
      await arcx?.connectWallet({
        account: account.address,
        chain: account.chainId,
      });
    };
    arcxConnectWallet();
  }, [account.chainId]);

  const addChain = useCallback(async (chainId: number) => {
    return walletAddChain(chainId);
  }, []);

  const addToken = useCallback(async (chainId: number, token: Token) => {
    return switchChainAndAddToken(chainId, token);
  }, []);

  // keep account information up to date
  useEffect(() => {
    const updateAccount = async () => {
      const account = await extractAccountFromSigner(signer);
      setAccount(account);
    };
    updateAccount();
  }, [signer]);

  const value = useMemo(
    () => ({
      connect,
      disconnect,
      switchChain,
      addChain,
      addToken,
      account,
      usedWallet,
    }),
    [account, addChain, addToken, connect, disconnect, switchChain],
  );

  return (
    <WalletContext.Provider value={value}> {children} </WalletContext.Provider>
  );
};

const extractAccountFromSigner = async (signer?: Signer) => {
  try {
    return {
      address: (await signer?.getAddress()) || undefined,
      isActive: (signer && !!(await signer.getAddress()) === null) || !!signer,
      signer,
      chainId: (await signer?.getChainId()) || undefined,
    };
  } catch {
    return {} as WalletAccount;
  }
};
