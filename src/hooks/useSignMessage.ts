import { useCallback, useState } from 'react';
import { isHex } from 'viem';
import { useSignMessage as useSignMessageWagmi } from 'wagmi';
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { ChainType } from '@lifi/sdk';

export enum SignMessageErrorType {
  UnsupportedWallet = 'unsupportedWallet',
  SignatureFailed = 'signatureFailed',
  Unknown = 'unknown',
}

export class SignMessageError extends Error {
  constructor(
    message: string,
    public type: SignMessageErrorType,
  ) {
    super(message);
    this.name = 'SignMessageError';
  }
}

export const useSignMessage = () => {
  const [isError, setIsError] = useState(false);
  const [errorType, setErrorType] = useState<SignMessageErrorType>(
    SignMessageErrorType.Unknown,
  );
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
      setErrorType(SignMessageErrorType.Unknown);

      try {
        let signature = '';

        if (isHex(walletAddress)) {
          signature = await signMessageAsync({
            account: walletAddress,
            message,
          });
        } else if (walletType === ChainType.SVM) {
          if (!solanaWallet.signMessage) {
            throw new SignMessageError(
              'Solana wallet does not support message signing',
              SignMessageErrorType.UnsupportedWallet,
            );
          }
          const encodedMessage = new TextEncoder().encode(message);
          const signatureBuffer =
            await solanaWallet.signMessage(encodedMessage);
          signature = Buffer.from(signatureBuffer).toString('base64');
        } else {
          throw new SignMessageError(
            'Unsupported wallet type',
            SignMessageErrorType.UnsupportedWallet,
          );
        }

        return signature;
      } catch (error) {
        setIsError(true);

        if (error instanceof SignMessageError) {
          setErrorType(error.type);
        } else {
          setErrorType(SignMessageErrorType.SignatureFailed);
        }

        throw error;
      }
    },
    [signMessageAsync, solanaWallet],
  );

  return {
    signMessageAsync: signMessageAsyncOverride,
    isError,
    errorType,
  };
};
