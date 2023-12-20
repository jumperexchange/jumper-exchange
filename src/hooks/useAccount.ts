import { ChainId, ChainType } from '@lifi/sdk';
import type { WalletAdapter } from '@solana/wallet-adapter-base';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';
import type { Chain } from 'viem';
import type { Connector } from 'wagmi';
import { useDisconnect, useAccount as useWagmiAccount } from 'wagmi';

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

export const useAccount = (): AccountResult => {
  const account = useWagmiAccount();
  const { wallet } = useWallet();

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
        }
      : {
          chainType: ChainType.SVM,
          isConnected: false,
          isConnecting: false,
          isReconnecting: false,
          isDisconnected: true,
          status: 'disconnected',
        };
    const evm: Account = { ...account, chainType: ChainType.EVM };

    return {
      account: account.isConnected ? evm : svm,
      accounts: [evm, svm],
    };
  }, [account, wallet]);
};

export const useAccountDisconnect = () => {
  const account = useWagmiAccount();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { wallet, disconnect } = useWallet();

  return () => {
    if (account.isConnected) {
      wagmiDisconnect();
    }
    if (wallet) {
      disconnect();
    }
  };
};
