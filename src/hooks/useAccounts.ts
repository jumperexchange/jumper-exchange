'use client';
import { ChainId, ChainType } from '@lifi/sdk';
import {
  useConfig as useBigmiConfig,
  type CreateConnectorFnExtended,
} from '@lifi/wallet-management';
import type { WalletAdapter } from '@solana/wallet-adapter-base';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const/trackingKeys';
import type { Chain } from 'viem';
import type { Config, Connector } from 'wagmi';
import { useAccount, useConfig as useWagmiConfig } from 'wagmi';
import { connect, disconnect, getAccount } from 'wagmi/actions';
import { create } from 'zustand';
import { useBlockchainExplorerURL } from './useBlockchainExplorerURL';
import type { CombinedWallet } from './useCombinedWallets';
import { useUserTracking } from './userTracking';

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

export interface UTXOAccount extends AccountBase {
  chainType: ChainType.UTXO;
  connector?: Connector;
}

export interface SVMAccount extends AccountBase {
  chainType: ChainType.SVM;
  connector?: WalletAdapter;
}

export type Account = EVMAccount | SVMAccount | UTXOAccount;

export interface AccountResult {
  account?: Account;
  accounts: Account[];
}

export type LastConnectedAccount =
  | WalletAdapter
  | Connector
  | CreateConnectorFnExtended
  | null;

interface LastConnectedAccountStore {
  lastConnectedAccount: LastConnectedAccount;
  setLastConnectedAccount: (account: LastConnectedAccount) => void;
}

export const useLastConnectedAccount = create<LastConnectedAccountStore>(
  (set) => ({
    lastConnectedAccount: null,
    setLastConnectedAccount: (account) =>
      set({ lastConnectedAccount: account }),
  }),
);

export const useAccounts = (): AccountResult => {
  const bigmiConfig = useBigmiConfig();
  const wagmiAccount = useAccount();
  const bigmiAccount = useAccount({ config: bigmiConfig });
  const { wallet } = useWallet();
  const getBlockexplorerURL = useBlockchainExplorerURL();
  const { lastConnectedAccount } = useLastConnectedAccount();
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
      ...wagmiAccount,
      chainType: ChainType.EVM,
      blockChainExplorerUrl: getBlockexplorerURL(
        wagmiAccount.address,
        wagmiAccount.chainId,
      ),
      icon: wagmiAccount.connector?.icon,
    };
    const utxo: Account = {
      ...bigmiAccount,
      chainType: ChainType.UTXO,
      blockChainExplorerUrl: getBlockexplorerURL(
        bigmiAccount.address,
        bigmiAccount.chainId,
      ),
      icon: bigmiAccount.connector?.icon,
    };

    const accounts = [evm, svm, utxo];
    const connectedAccounts = accounts.filter(
      (account) => account.isConnected && account.address,
    );

    // If lastConnectedAccount exists, attempt to find a connected account with a matching connector ID or name.
    // If no matching account is found, fallback to the first connected account.
    // If lastConnectedAccount is not present, simply select the first connected account.
    const selectedAccount = lastConnectedAccount
      ? connectedAccounts.find((account) => {
          const connectorIdMatch =
            (lastConnectedAccount as Connector)?.id ===
            (account.connector as Connector)?.id;
          const connectorNameMatch =
            !(lastConnectedAccount as Connector)?.id &&
            (lastConnectedAccount as WalletAdapter)?.name ===
              account.connector?.name;
          return connectorIdMatch || connectorNameMatch;
        }) || connectedAccounts[0]
      : connectedAccounts[0];

    return {
      account: selectedAccount,
      accounts: [evm, svm, utxo],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    wallet,
    getBlockexplorerURL,
    wagmiAccount.connector?.uid,
    wagmiAccount.connector?.id,
    wagmiAccount.status,
    wagmiAccount.address,
    bigmiAccount.connector?.uid,
    bigmiAccount.connector?.id,
    bigmiAccount.status,
    bigmiAccount.address,
    lastConnectedAccount,
  ]);
};

export const useAccountDisconnect = () => {
  const bigmiConfig = useBigmiConfig();
  const wagmiConfig = useWagmiConfig();
  const { disconnect: solanaDisconnect } = useWallet();

  const handleDisconnect = async (config: Config) => {
    const connectedAccount = getAccount(config);
    if (connectedAccount.connector) {
      await disconnect(config, { connector: connectedAccount.connector });
    }
  };

  return (account: Account) => {
    switch (account.chainType) {
      case ChainType.EVM:
        handleDisconnect(wagmiConfig);
        break;
      case ChainType.UTXO:
        handleDisconnect(bigmiConfig);
        break;
      default:
        solanaDisconnect();
    }
  };
};

export const useAccountConnect = () => {
  const bigmiConfig = useBigmiConfig();
  const wagmiConfig = useWagmiConfig();
  const { select, disconnect: svmDisconnect, connected } = useWallet();
  const { trackEvent } = useUserTracking();
  const { setLastConnectedAccount } = useLastConnectedAccount();

  const handleDisconnect = async (config: Config) => {
    const connectedAccount = getAccount(config);
    if (connectedAccount.connector) {
      await disconnect(config, { connector: connectedAccount.connector });
    }
  };

  const handleConnect = async (
    config: Config,
    connector: Connector | CreateConnectorFnExtended,
    chainType: ChainType,
  ) => {
    await handleDisconnect(config);
    const walletDisplayName =
      (connector as CreateConnectorFnExtended)?.displayName ||
      (connector as Connector)?.name;
    const data = await connect(config, { connector: connector });
    setLastConnectedAccount(connector);
    trackEvent({
      category: TrackingCategory.Connect,
      action: TrackingAction.ConnectWallet,
      label: 'connect-wallet',
      data: {
        [TrackingEventParameter.Wallet]: walletDisplayName,
        [TrackingEventParameter.Ecosystem]: chainType,
        [TrackingEventParameter.ChainId]: data.chainId,
        [TrackingEventParameter.WalletAddress]: `${data.accounts?.[0]}`,
      },
    });
  };

  return async (combinedWallet: CombinedWallet) => {
    if (combinedWallet.evm) {
      await handleConnect(wagmiConfig, combinedWallet.evm, ChainType.EVM);
    } else if (combinedWallet.svm) {
      const svm = combinedWallet.svm;
      if (connected) {
        svmDisconnect();
      }
      select(svm.adapter.name);
      combinedWallet.svm.adapter.once('connect', (publicKey) => {
        setLastConnectedAccount(svm.adapter);
        trackEvent({
          category: TrackingCategory.Connect,
          action: TrackingAction.ConnectWallet,
          label: 'connect-wallet',
          data: {
            [TrackingEventParameter.Wallet]: svm.adapter.name,
            [TrackingEventParameter.Ecosystem]: ChainType.SVM,
            [TrackingEventParameter.ChainId]: ChainId.SOL,
            [TrackingEventParameter.WalletAddress]: publicKey?.toString(),
          },
        });
      });
    } else if (combinedWallet.utxo) {
      await handleConnect(bigmiConfig, combinedWallet.utxo, ChainType.UTXO);
    }
  };
};
