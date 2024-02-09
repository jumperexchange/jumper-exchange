'use client';
import { ChainId, ChainType } from '@lifi/sdk';
import type { WalletAdapter } from '@solana/wallet-adapter-base';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';
import type { Chain } from 'viem';
import type { Connector } from 'wagmi';
import {
  useConnect,
  useDisconnect,
  useAccount as useWagmiAccount,
} from 'wagmi';
import { useBlockchainExplorerURL, useUserTracking } from '.';
import { useSettingsStore } from '../stores';
import type { CombinedWallet } from './useCombinedWallets';

export interface AccountBase {
  address?: string;
  addresses?: readonly string[];
  chain?: Chain;
  chainId?: number;
  chainType?: ChainType;
  isConnected: boolean;
  isConnecting: boolean;
  isDisconnected: boolean;
  isReconnecting: boolean;
  status: 'connected' | 'reconnecting' | 'connecting' | 'disconnected';
  blockChainExplorerUrl?: string;
  icon?: string;
}

export interface EVMAccount extends AccountBase {
  chainType: ChainType.EVM;
  connector?: Connector;
}

export interface SVMAccount extends AccountBase {
  chainType: ChainType.SVM;
  connector?: WalletAdapter;
}

export type Account = EVMAccount | SVMAccount;

export interface AccountResult {
  account: Account;
  accounts: Account[];
}

export const useAccounts = (): AccountResult => {
  const account = useWagmiAccount();
  const { wallet } = useWallet();
  const getBlockexplorerURL = useBlockchainExplorerURL();
  return useMemo(() => {
    const svm: Account = wallet?.adapter.publicKey
      ? {
          address: wallet?.adapter.publicKey.toString(),
          chainId: ChainId.SOL,
          chainType: ChainType.SVM,
          connector: wallet?.adapter,
          isConnected: Boolean(wallet?.adapter.publicKey),
          isConnecting: false,
          isReconnecting: false,
          isDisconnected: !wallet,
          status: 'connected',
          blockChainExplorerUrl: getBlockexplorerURL(
            wallet?.adapter.publicKey.toString(),
            ChainId.SOL,
          ),
          icon: wallet?.adapter.icon,
        }
      : {
          chainType: ChainType.SVM,
          isConnected: false,
          isConnecting: false,
          isReconnecting: false,
          isDisconnected: true,
          status: 'disconnected',
          blockChainExplorerUrl: undefined,
          icon: undefined,
        };
    const evm: Account = {
      ...account,
      chainType: ChainType.EVM,
      blockChainExplorerUrl: getBlockexplorerURL(
        account.address,
        account.chainId,
      ),
      icon: account.connector?.icon,
    };

    return {
      account: account.isConnected ? evm : svm,
      accounts: [evm, svm],
    };
  }, [account, getBlockexplorerURL, wallet]);
};

export const useAccountDisconnect = () => {
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { disconnect: solanaDisconnect } = useWallet();

  return (account: Account) => {
    if (account.chainType === ChainType.SVM) {
      solanaDisconnect();
    } else {
      wagmiDisconnect();
    }
  };
};

export const useAccountConnect = () => {
  const { connectAsync } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { select, disconnect, connected, publicKey } = useWallet();
  const { onWalletConnect } = useSettingsStore((state) => state);
  const { trackConnectWallet } = useUserTracking();

  return async (combinedWallet: CombinedWallet) => {
    if (combinedWallet.evm) {
      wagmiDisconnect();
      await connectAsync({ connector: combinedWallet.evm! });
      onWalletConnect(combinedWallet.evm.name);
      trackConnectWallet({
        walletName: combinedWallet.evm.name,
        chainType: ChainType.EVM,
        chainId: await combinedWallet.evm.getChainId(),
        address: `${await combinedWallet.evm.getAccounts()}`,
      });
    } else if (combinedWallet.svm) {
      if (connected) {
        disconnect();
      }
      select(combinedWallet.svm.adapter.name);
      onWalletConnect(combinedWallet.svm.adapter.name);

      trackConnectWallet({
        walletName: combinedWallet.svm.adapter.name,
        chainType: ChainType.SVM,
        chainId: ChainId.SOL,
      });
    }
  };
};
