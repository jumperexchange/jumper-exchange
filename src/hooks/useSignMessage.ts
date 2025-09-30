import { useCallback, useState } from 'react';
import { isHex } from 'viem';
import { useSignMessage as useSignMessageWagmi } from 'wagmi';
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';

export const useSignMessage = () => {
  const [isError, setIsError] = useState(false);
  const { signMessageAsync } = useSignMessageWagmi();
  const solanaWallet = useSolanaWallet();

  const signMessageAsyncOverride = useCallback(
    async ({
      message,
      walletAddress,
      walletType,
    }: {
      message: string;
      walletAddress: string;
      walletType?: string;
    }) => {
      setIsError(false);
      try {
        let signature = '';
        if (isHex(walletAddress)) {
          signature = await signMessageAsync({
            account: walletAddress,
            message,
          });
        } else if (walletType === 'SVM') {
          if (!solanaWallet.signMessage) {
            throw new Error('Solana wallet does not support message signing');
          }
          const encodedMessage = new TextEncoder().encode(message);
          const signatureBuffer =
            await solanaWallet.signMessage(encodedMessage);
          signature = Buffer.from(signatureBuffer).toString('base64');
        } else {
          throw new Error('Unsupported wallet type');
        }

        return signature;
      } catch (error) {
        setIsError(true);
        throw error;
      }
    },
    [signMessageAsync, solanaWallet],
  );

  return {
    signMessageAsync: signMessageAsyncOverride,
    isError,
  };
};
