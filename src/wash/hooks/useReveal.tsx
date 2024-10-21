import { useCallback, useState } from 'react';
import { useUmi } from '../contexts/useUmi';
import { WASH_ENDPOINT_ROOT_URI } from '../utils/constants';
import axios from 'axios';
import { base58 } from '@metaplex-foundation/umi/serializers';
import { useWallet } from '@solana/wallet-adapter-react';

export type TRevealHook = {
  onReveal: VoidFunction;
  isRevealing: boolean;
  hasCanceledReveal: boolean;
  error?: string;
  revealStatus: string;
};

export function useReveal(refetchNft?: VoidFunction): TRevealHook {
  const [isRevealing, set_isRevealing] = useState(false);
  const [hasCanceledReveal, set_hasCanceledReveal] = useState(false);
  const [error, set_error] = useState<string | undefined>('');
  const [revealStatus, set_revealStatus] = useState('');
  const { umi } = useUmi();
  const wallet = useWallet();

  const onReveal = useCallback(async () => {
    if (!umi || !wallet?.connected || !wallet.publicKey) {
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
      const signature = await umi.rpc.sendTransaction(signed);
      const [txHash] = base58.deserialize(signature);

      const responseRevealDone = await axios.post(
        `${WASH_ENDPOINT_ROOT_URI}/reveal/done`,
        {
          assetAddress: data.assetAddress,
          txHash,
          userPublicKey: umi.identity.publicKey,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      await umi.rpc.confirmTransaction(signature, {
        strategy: {
          type: 'blockhash',
          ...(await umi.rpc.getLatestBlockhash()),
        },
        commitment: 'finalized',
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
      await refetchNft?.();
      setTimeout(() => set_isRevealing(false), 1000);
      setTimeout(() => set_hasCanceledReveal(false), 1300);
    }
  }, [umi, wallet, refetchNft]);

  return {
    onReveal,
    isRevealing,
    revealStatus,
    error,
    hasCanceledReveal,
  };
}
