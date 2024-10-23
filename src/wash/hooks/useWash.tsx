import { useCallback, useState } from 'react';
import { useUmi } from '../contexts/useUmi';
import { WASH_ENDPOINT_ROOT_URI } from '../utils/constants';
import { utf8 } from '@metaplex-foundation/umi/serializers';
import { useWallet } from '@solana/wallet-adapter-react';

import type { TCleaningItem } from '../types/wash';

export type TUseWash = {
  onWash: (item: TCleaningItem, shouldOverkill?: boolean) => Promise<void>;
  isWashing: boolean;
  error: string;
  washStatus: string;
};

export function useWash(
  refetchItems?: VoidFunction,
  refetchNft?: VoidFunction,
): TUseWash {
  const wallet = useWallet();
  const [isWashing, set_isWashing] = useState(false);
  const [error, set_error] = useState('');
  const [washStatus, set_washStatus] = useState('');
  const { umi } = useUmi();

  const onWash = useCallback(
    async (item: TCleaningItem): Promise<void> => {
      if (!umi || !wallet?.connected || !wallet.publicKey) {
        console.error('Wallet not connected or Umi not initialized');
        return;
      }

      try {
        set_isWashing(true);
        const message = utf8.serialize(item.message);
        const signedMessage = await umi.identity.signMessage(message);
        const responseUseItem = await fetch(
          `${WASH_ENDPOINT_ROOT_URI}/user/${umi.identity.publicKey}/item/item${item.id}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${wallet.publicKey?.toBase58()}`,
            },
            body: JSON.stringify({
              message: Array.from(message),
              signature: Array.from(signedMessage),
            }),
          },
        );

        set_isWashing(false);
        set_washStatus(responseUseItem.statusText);
        refetchItems?.();
        refetchNft?.();
      } catch (err) {
        set_isWashing(false);
        set_error(
          err instanceof Error
            ? err.message
            : 'An error occurred while washing.',
        );
      }
    },
    [refetchItems, refetchNft, umi, wallet?.connected, wallet.publicKey],
  );

  return {
    washStatus,
    onWash,
    error,
    isWashing,
  };
}
