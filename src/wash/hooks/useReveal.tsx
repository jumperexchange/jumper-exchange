import { useCallback, useState } from 'react';
import { useUmi } from '../contexts/useUmi';
import { WASH_ENDPOINT_ROOT_URI } from '../utils/constants';
import { base58 } from '@metaplex-foundation/umi/serializers';
import { useAccount } from '@lifi/wallet-management';
import { ChainType } from '@lifi/sdk';

export type TRevealHook = {
  onReveal: VoidFunction;
  isRevealing: boolean;
  hasCanceledReveal: boolean;
  error?: string;
  revealStatus: string;
};

export function useReveal(
  refetchNft?: VoidFunction,
  refetchCollection?: VoidFunction,
): TRevealHook {
  const { account } = useAccount({ chainType: ChainType.SVM });
  const [isRevealing, set_isRevealing] = useState(false);
  const [hasCanceledReveal, set_hasCanceledReveal] = useState(false);
  const [error, set_error] = useState<string | undefined>('');
  const [revealStatus, set_revealStatus] = useState('');
  const { umi } = useUmi();

  const onReveal = useCallback(async () => {
    if (!umi || !account.isConnected || !account.address) {
      console.error('Wallet not connected or Umi not initialized');
      return;
    }

    try {
      set_isRevealing(true);
      const responseRevealNft = await fetch(
        `${WASH_ENDPOINT_ROOT_URI}/reveal`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userPublicKey: umi.identity.publicKey,
          }),
        },
      );

      const data = (await responseRevealNft.json()) as any;
      const tx = umi.transactions.deserialize(new Uint8Array(data.tx));
      const signed = await umi.identity.signTransaction(tx);
      const signature = await umi.rpc.sendTransaction(signed, {
        preflightCommitment: 'confirmed',
        commitment: 'confirmed',
      });
      const [txHash] = base58.deserialize(signature);

      const responseRevealDone = await fetch(
        `${WASH_ENDPOINT_ROOT_URI}/reveal/done`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            assetAddress: data.assetAddress,
            txHash,
            userPublicKey: umi.identity.publicKey,
          }),
        },
      );

      await umi.rpc.confirmTransaction(signature, {
        commitment: 'confirmed',
        strategy: {
          type: 'blockhash',
          ...(await umi.rpc.getLatestBlockhash()),
        },
      });

      set_revealStatus(responseRevealDone.statusText);
    } catch (err) {
      set_hasCanceledReveal(true);
      set_error(
        err instanceof Error
          ? err.message
          : 'An error occurred while revealing',
      );
    } finally {
      await Promise.all([refetchNft?.(), refetchCollection?.()]);
      setTimeout(() => set_isRevealing(false), 100);
      setTimeout(() => set_hasCanceledReveal(false), 700);
      setTimeout(() => set_error(undefined), 4000);
    }
  }, [
    umi,
    account.isConnected,
    account.address,
    refetchNft,
    refetchCollection,
  ]);

  return {
    onReveal,
    isRevealing,
    revealStatus,
    error,
    hasCanceledReveal,
  };
}
