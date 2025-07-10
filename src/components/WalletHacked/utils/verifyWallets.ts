import * as Sentry from '@sentry/nextjs';
import { useMutation } from '@tanstack/react-query';
import { EVMAddress } from 'src/types/internal';

interface VerifyWalletProps {
  address: string;
  message: string;
  signature: EVMAddress;
}

interface VerifyWalletsProps {
  originWallet: VerifyWalletProps;
  destinationWallet: VerifyWalletProps;
}

const sentryHint = {
  tags: {
    component: 'WalletHackedSummary',
    action: 'verifyWallets',
  },
};

export const verifyWallets = async ({
  originWallet,
  destinationWallet,
}: VerifyWalletsProps) => {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const response = await fetch(`${apiBaseUrl}/auth/verify-wallets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        origin_wallet: originWallet,
        destination_wallet: destinationWallet,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit transfer request');
    }

    const responseData = await response.json();
    const verificationId = responseData.data.verification_id;
    return { success: true, verificationId };
  } catch (error) {
    if (error instanceof Error) {
      const errorMessage = error.message;
      console.error(errorMessage);
      Sentry.captureException(`Error verifying wallets: ${errorMessage}`, {
        ...sentryHint,
        extra: {
          originWallet,
          destinationWallet,
        },
      });
    }
  }
};

export const useVerifyWallets = () => {
  return useMutation({
    mutationFn: (props: VerifyWalletsProps) => {
      return verifyWallets(props);
    },
  });
};
