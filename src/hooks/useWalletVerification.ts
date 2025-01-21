import { useQuery } from '@tanstack/react-query';

const VERIFY_WALLET_ENDPOINT = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-wallet`;

export const useWalletVerification = ({
  evmAddress,
  evmMessage,
  evmSignature,
  solanaSignature,
  solanaPublicKey,
  enabled,
  queryKey,
}: {
  evmAddress?: string;
  evmMessage?: string;
  evmSignature?: string;
  solanaSignature?: string;
  solanaPublicKey?: string;
  enabled?: boolean;
  queryKey?: string;
}) => {
  const { data, isSuccess } = useQuery({
    queryKey: ['wallet-verification', queryKey],
    queryFn: async () => {
      const response = await fetch(VERIFY_WALLET_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          evm: {
            address: evmAddress,
            message: evmMessage,
            signature: evmSignature,
          },
          solana: {
            message: 'Sign in with Solana to the app.',
            signature: solanaSignature,
            publicKey: solanaPublicKey,
          },
        }),
      });
      const result = await response.json();
      return result;
    },
    enabled: enabled,
  });

  return {
    data,
    isSuccess,
  };
};
