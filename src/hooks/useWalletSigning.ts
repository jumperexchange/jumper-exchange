'use client';

import { HACKED_WALLET_STEPS } from '@/components/WalletHacked/constants';
import { useAccount } from '@lifi/wallet-management';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSignMessage } from 'wagmi';

export interface Message {
  prepareMessage(): string;
}

export const useWalletSigning = () => {
  const { t } = useTranslation();
  const { account } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const prepareSigningMessage = useCallback(
    (
      address: string,
      type:
        | (typeof HACKED_WALLET_STEPS)['SOURCE_SIGN']
        | (typeof HACKED_WALLET_STEPS)['DESTINATION_SIGN'],
      points: number,
    ): string => {
      return type === HACKED_WALLET_STEPS.SOURCE_SIGN
        ? t('walletHacked.signatureMsg.source', { points })
        : t('walletHacked.signatureMsg.destination', { points });
    },
    [],
  );

  const signWallet = useCallback(
    async (message: string) => {
      if (!account?.address) {
        console.error('No wallet connected. Account:', account);
        throw new Error('Wallet not connected');
      }

      try {
        const messageToSign = message;

        const signature = await signMessageAsync({
          account: account.address as `0x${string}`,
          message: messageToSign,
        });

        return signature;
      } catch (error) {
        console.error('Error signing message:', error);
        throw error;
      }
    },
    [account, signMessageAsync],
  );

  return {
    signWallet,
    prepareSigningMessage,
    isConnected: Boolean(account?.address),
  };
};
