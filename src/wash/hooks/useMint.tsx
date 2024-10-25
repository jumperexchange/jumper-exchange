import { useCallback, useState } from 'react';
import { useUmi } from '../contexts/useUmi';
import { WASH_ENDPOINT_ROOT_URI } from '../utils/constants';
import { ChainType } from '@lifi/sdk';
import { useAccount } from '@lifi/wallet-management';
import { base58 } from '@metaplex-foundation/umi/serializers';

export type TUseMint = {
  onMint: VoidFunction;
  mintStatus: string;
  isMinting: boolean;
  error?: string;
};

export function useMint(
  refetchNft?: VoidFunction,
  refetchUser?: VoidFunction,
): TUseMint {
  const [isMinting, set_isMinting] = useState(false);
  const [error, set_error] = useState<string | undefined>();
  const [mintStatus, set_mintStatus] = useState('');
  const { umi } = useUmi();
  const { account } = useAccount({ chainType: ChainType.SVM });

  const onMint = useCallback(async (): Promise<void> => {
    if (!umi || !account.isConnected || !account.address) {
      console.error('Wallet not connected or Umi not initialized');
      return;
    }

    /******************************************************************************************
     * Prepare the NFT mint, we need this because the backend will sign the authorization to
     * reveal the NFT and the user will use that signature to mint the NFT
     ******************************************************************************************/
    let responsePrepareNft: Response | undefined = undefined;
    try {
      set_isMinting(true);
      responsePrepareNft = await fetch(
        `${WASH_ENDPOINT_ROOT_URI}/mint/prepare`,
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
    } catch (err) {
      set_isMinting(false);
      set_error(
        err instanceof Error ? err.message : 'An error occured while minting',
      );
      console.error('Error minting NFT:', error);
    }

    /******************************************************************************************
     * Send the transaction to the Solana RPC
     ******************************************************************************************/
    let signature: Uint8Array | undefined = undefined;
    let data: { tx: ArrayBufferLike; assetAddress: string } | undefined =
      undefined;

    try {
      if (!responsePrepareNft) {
        throw new Error('Response from prepare NFT is undefined');
      }
      data = (await responsePrepareNft.json()) as {
        tx: ArrayBufferLike;
        assetAddress: string;
      };
      if (!data || !data.tx || !data.assetAddress) {
        throw new Error('Invalid data received from prepare NFT');
      }
      const tx = umi.transactions.deserialize(new Uint8Array(data.tx));
      const signed = await umi.identity.signTransaction(tx);
      signature = await umi.rpc.sendTransaction(signed);
    } catch (err) {
      set_isMinting(false);
      set_error(
        err instanceof Error ? err.message : 'An error occured while minting',
      );
      console.error('Error minting NFT:', error);
    }

    /******************************************************************************************
     * Update the backend state with the mint info.
     ******************************************************************************************/
    try {
      if (!signature || !data) {
        throw new Error('Signature or data is undefined');
      }
      const [txHash] = base58.deserialize(signature);
      const responseSaveNft = await fetch(
        `${WASH_ENDPOINT_ROOT_URI}/mint/done`,
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

      const dataSaveNft = responseSaveNft.json() as any;

      // Wait for transaction to be confirmed
      await umi.rpc.confirmTransaction(signature, {
        commitment: 'confirmed',
        strategy: {
          type: 'blockhash',
          ...(await umi.rpc.getLatestBlockhash()),
        },
      });
      set_mintStatus(dataSaveNft.statusText);
    } catch (err) {
      set_isMinting(false);
      set_error(
        err instanceof Error ? err.message : 'An error occured while minting',
      );
      console.error('Error minting NFT:', error);
    } finally {
      await Promise.all([refetchNft?.(), refetchUser?.()]);
      set_isMinting(false);
    }
  }, [
    umi,
    account.isConnected,
    account.address,
    refetchNft,
    refetchUser,
    error,
  ]);

  return {
    onMint,
    mintStatus,
    isMinting,
    error,
  };
}
