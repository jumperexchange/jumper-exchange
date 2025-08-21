import { useCallback } from 'react';
import { EVMAddress } from 'src/types/internal';
import { useConfig, useWalletClient } from 'wagmi';
import { useBiconomyClientsStore } from 'src/stores/biconomyClients/BiconomyClientsStore';
import { Account, useAccount } from '@lifi/wallet-management';
import { ChainId, ChainType } from '@lifi/sdk';
import { isIframeEnvironment } from 'src/utils/iframe';

interface WalletClientParams {
  address?: EVMAddress;
  chainId?: number;
  projectAddress: EVMAddress;
  projectChainId: number;
}

const getEVMProvider = async (connector: any) => {
  if (connector && 'getProvider' in connector) {
    return await connector.getProvider();
  }
  return window.ethereum;
};

const validateAccountChainType = (account: Account) => {
  return !account.chainType || account.chainType === ChainType.EVM;
};

export const useWalletClientInitialization = (allowedChains: ChainId[]) => {
  const wagmiConfig = useConfig();
  const { getClients } = useBiconomyClientsStore();
  const { account } = useAccount();
  const { address, chainId } = account;
  const isEmbeddedWallet = useIsEmbeddedWallet();
  const { data: walletClient } = useWalletClient({
    account: address as EVMAddress,
    chainId,
    query: {
      enabled: !!address && !!chainId,
    },
  });

  console.warn('🔍 isEmbeddedWallet', isEmbeddedWallet);

  const initializeClients = useCallback(
    async ({
      address,
      chainId,
      projectAddress,
      projectChainId,
    }: WalletClientParams) => {
      try {
        if (!validateAccountChainType(account)) {
          throw new Error('Account is not an EVM account');
        }

        if (chainId && !allowedChains.includes(chainId)) {
          throw new Error('Chain is not allowed');
        }

        console.warn(
          'initializeClients based on these wallet client values',
          'walletClient chain:',
          walletClient?.chain?.id,
          'walletClient address:',
          walletClient?.account.address,
          'priority address:',
          address,
          'priority chainId:',
          chainId,
        );

        if (
          address &&
          chainId &&
          (walletClient?.account.address !== address ||
            walletClient?.chain?.id !== chainId)
        ) {
          throw new Error(
            'Current wallet client is initialized on different chain or address',
          );
        }

        const provider = await getEVMProvider(account.connector);

        // Note: getClients would need to be passed as parameter or imported
        const biconomyClients = await getClients(
          projectAddress,
          projectChainId,
          walletClient,
          provider,
          chainId,
        );

        return { walletClient, biconomyClients };
      } catch (error) {
        console.error('Failed to initialize clients:', error);
        return { walletClient: null, biconomyClients: null };
      }
    },
    [
      wagmiConfig,
      walletClient?.account.address,
      walletClient?.chain?.id,
      account,
      allowedChains,
    ],
  );

  return { initializeClients };
};

const EMBEDDED_WALLETS = [
  'magic',
  'privy',
  'dynamic',
  'thirdweb',
  'particle',
  'web3auth',
  'fireblocks',
  'fortmatic',
  'torus',
  'capsule',
  'turnkey',
  'dfns',
];

export const useIsEmbeddedWallet = (): boolean => {
  const { account } = useAccount();

  console.warn('🔍 account.connector', account.connector);

  if (isIframeEnvironment()) return true;

  if (!account?.connector) return false;

  const connector = account.connector as any;

  // Check explicit flags first
  if (
    connector.isEmbedded === true ||
    connector.custodial === true ||
    connector.options?.isEmbedded === true
  ) {
    return true;
  }

  // If explicitly injected, it's external
  if (connector.isInjected === true || connector.type === 'injected') {
    return false;
  }

  // Check by wallet name/id
  const name = (connector.name || '').toLowerCase();
  const id = (connector.id || '').toLowerCase();

  return EMBEDDED_WALLETS.some(
    (wallet) => name.includes(wallet) || id.includes(wallet),
  );
};
