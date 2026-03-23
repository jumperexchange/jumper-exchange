import { useCallback } from 'react';
import { isHex } from 'viem';
import { useSignMessage as useSignMessageWagmi } from 'wagmi';
import { useWalletSession } from '@solana/react-hooks';
import { ChainType } from '@lifi/sdk';
import { useMutation } from '@tanstack/react-query';

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

interface SignMessageParams {
  message: string;
  walletAddress: string;
  walletType?: string;
}

export const useSignMessage = () => {
  const { signMessageAsync } = useSignMessageWagmi();
  const solanaSession = useWalletSession();

  const signMessageFn = useCallback(
    async ({
      message,
      walletAddress,
      walletType,
    }: SignMessageParams): Promise<string> => {
      try {
        let signature = '';

        if (isHex(walletAddress)) {
          signature = await signMessageAsync({
            account: walletAddress,
            message,
          });
        } else if (walletType === ChainType.SVM) {
          if (!solanaSession?.signMessage) {
            throw new SignMessageError(
              'Solana wallet does not support message signing',
              SignMessageErrorType.UnsupportedWallet,
            );
          }
          const encodedMessage = new TextEncoder().encode(message);
          const signatureBytes =
            await solanaSession.signMessage(encodedMessage);
          signature = Buffer.from(signatureBytes).toString('base64');
        } else {
          throw new SignMessageError(
            'Unsupported wallet type',
            SignMessageErrorType.UnsupportedWallet,
          );
        }

        return signature;
      } catch (error) {
        if (error instanceof SignMessageError) {
          throw error;
        }
        throw new SignMessageError(
          'Failed to sign message',
          SignMessageErrorType.SignatureFailed,
        );
      }
    },
    [signMessageAsync, solanaSession],
  );

  const mutation = useMutation({
    mutationFn: signMessageFn,
  });

  const errorType =
    mutation.error instanceof SignMessageError
      ? mutation.error.type
      : SignMessageErrorType.Unknown;

  return {
    signMessageAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    errorType,
    reset: mutation.reset,
    error: mutation.error,
  };
};
