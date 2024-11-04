import { useCallback, useState } from 'react';
import { useUmi } from '../contexts/useUmi';
import { utf8 } from '@metaplex-foundation/umi/serializers';

import type { TCleaningItem } from '../types/wash';
import { useAccount } from '@lifi/wallet-management';
import { ChainType } from '@lifi/sdk';

export type TUseWash = {
  onWash: (item: TCleaningItem, shouldOverkill?: boolean) => Promise<void>;
  isWashing: boolean;
  error: string;
  washStatus: string;
};

export function useWash(
  refetchItems?: VoidFunction,
  refetchNft?: VoidFunction,
  refetchCollection?: VoidFunction,
): TUseWash {
  const { account } = useAccount({ chainType: ChainType.SVM });
  const [isWashing, set_isWashing] = useState(false);
  const [error, set_error] = useState('');
  const [washStatus, set_washStatus] = useState('');
  const { umi } = useUmi();

  const onWash = useCallback(
    async (item: TCleaningItem): Promise<void> => {
      if (!umi || !account.isConnected || !account.address) {
        console.error('Wallet not connected or Umi not initialized');
        return;
      }

      try {
        set_isWashing(true);
        const message = utf8.serialize(item.message);
        const signedMessage = await umi.identity.signMessage(message);
        const responseUseItem = await fetch('/api/items/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: Array.from(message),
            signature: Array.from(signedMessage),
            item: item.id,
            publicKey: umi.identity.publicKey,
          }),
        });

        set_isWashing(false);
        set_washStatus(responseUseItem.statusText);
        await Promise.all([
          refetchItems?.(),
          refetchNft?.(),
          refetchCollection?.(),
        ]);
      } catch (err) {
        set_isWashing(false);
        set_error(
          err instanceof Error
            ? err.message
            : 'An error occurred while washing.',
        );
      }
    },
    [
      refetchItems,
      refetchNft,
      refetchCollection,
      umi,
      account.isConnected,
      account.address,
    ],
  );

  return {
    washStatus,
    onWash,
    error,
    isWashing,
  };
}
