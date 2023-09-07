import type { Signer } from '@ethersproject/abstract-signer';
import { ChainId, Token } from '@lifi/sdk';
import {
  LiFiWalletManagement,
  Wallet,
  readActiveWallets,
  supportedWallets,
} from '@lifi/wallet-management';

import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  WalletAccount,
  WalletContextProps,
} from '@transferto/shared/src/types/wallet';
import { useUserTracking } from '../hooks';
import { useMultisig } from '../hooks/useMultisig';

const liFiWalletManagement = new LiFiWalletManagement();

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
  const [account, setAccount] = useState<WalletAccount>({});
  const [currentWallet, setCurrentWallet] = useState<Wallet | undefined>();
  const { trackConnectWallet } = useUserTracking();
  const { checkMultisigEnvironment } = useMultisig();

  const connectMultisigWallet = async () => {
    const isMultisig = await checkMultisigEnvironment();

    if (!isMultisig) {
      return;
    }

    const multisigWallet = supportedWallets.find(
      (wallet) => wallet.name === 'Safe',
    );
    if (multisigWallet) {
      await liFiWalletManagement.connect(multisigWallet);
    }
  };

  // autoConnect
  useEffect(() => {
    const autoConnect = async () => {
      await connectMultisigWallet();
      const persistedActiveWallets = readActiveWallets();
      const activeWallets = supportedWallets.filter((wallet) =>
        persistedActiveWallets.some(
          (perstistedWallet) => perstistedWallet.name === wallet.name,
        ),
      );
      if (!activeWallets.length) {
        return;
      }
      await liFiWalletManagement.autoConnect(activeWallets);
      activeWallets[0].on('walletAccountChanged', handleWalletUpdate);
      handleWalletUpdate(activeWallets[0]);
    };
    autoConnect();
    // fixing: disconnect only works on 2nd attempt
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleWalletUpdate = async (wallet?: Wallet) => {
    setCurrentWallet(wallet);
    const account = await extractAccountFromSigner(wallet?.account?.signer);
    setAccount(account);
  };

  const connect = useCallback(async (wallet: Wallet) => {
    await liFiWalletManagement.connect(wallet);
    wallet.on('walletAccountChanged', handleWalletUpdate);

    handleWalletUpdate(wallet);
  }, []);

  const disconnect = useCallback(async () => {
    if (currentWallet) {
      await liFiWalletManagement.disconnect(currentWallet);
      currentWallet.removeAllListeners();
      handleWalletUpdate(undefined);
      trackConnectWallet({
        account: account,
        disconnect: true,
      });
    }
  }, [account, currentWallet, trackConnectWallet]);

  const switchChain = useCallback(
    async (chainId: number) => {
      try {
        await currentWallet?.switchChain(chainId);
        handleWalletUpdate(currentWallet);
        return true;
      } catch {
        return false;
      }
    },
    [currentWallet],
  );

  const addChain = useCallback(
    async (chainId: number) => {
      try {
        await currentWallet?.addChain(chainId);
        handleWalletUpdate(currentWallet);
        return true;
      } catch {
        return false;
      }
    },
    [currentWallet],
  );

  const addToken = useCallback(
    async (chainId: number, token: Token) => {
      await currentWallet?.addToken(chainId, token);
      handleWalletUpdate(currentWallet);

      return;
    },
    [currentWallet],
  );

  useEffect(() => {
    trackConnectWallet({
      account: account,
      disconnect: false,
      data: {
        account: account.address as string,
        chain: account.chainId as ChainId,
      },
    });
  }, [
    account,
    account.signer,
    account.address,
    account.chainId,
    trackConnectWallet,
  ]);

  const value = useMemo(
    () => ({
      connect,
      disconnect,
      switchChain,
      addChain,
      addToken,
      account,
      usedWallet: currentWallet,
    }),
    [
      account,
      addChain,
      addToken,
      connect,
      disconnect,
      switchChain,
      currentWallet,
    ],
  );

  return (
    <WalletContext.Provider value={value}> {children} </WalletContext.Provider>
  );
};

const extractAccountFromSigner = async (
  signer?: Signer,
): Promise<WalletAccount> => {
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
