import { keyframes } from '@mui/material';
import { Inter_Tight } from 'next/font/google';
import { Bagel_Fat_One } from 'next/font/google';

interface CheckWinningSwapParams {
  txHash: string;
  userAddress: string;
  fromChainId: number;
  toChainId: number;
  fromToken: {
    address: string;
    symbol: string;
    decimals: number;
  };
  toToken: {
    address: string;
    symbol: string;
    decimals: number;
  };
  fromAmount: string;
}

interface CheckWinningSwapResponse {
  winner: boolean;
  position: number;
  id: string;
}

interface SubmitContactResponse {
  success: boolean;
  message: string;
}

interface SubmitContactParams {
  address: string;
  signature: string;
  contact: string;
  timestamp: number;
}

export const slideInFromRight = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

export const slideOutToRight = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
`;

export const slideInFromBottom = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

export const slideOutToBottom = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
`;

export const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter-tight',
});

export const bagelFatOne = Bagel_Fat_One({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bagel-fat-one',
  weight: ['400'],
});

export async function checkWinningSwap({
  txHash,
  userAddress,
  fromChainId,
  toChainId,
  fromToken,
  toToken,
  fromAmount,
}: CheckWinningSwapParams): Promise<CheckWinningSwapResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_GOLDEN_TICKET_API_URL}/golden-ticket/verify-transaction`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: userAddress,
          txHash,
          fromChainId,
          toChainId,
          fromToken,
          toToken,
          fromAmount,
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to check winning swap');
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking winning swap:', error);
    return {
      winner: false,
      position: 0,
      id: '',
    };
  }
}

export async function submitContact({
  address,
  signature,
  contact,
  timestamp,
}: SubmitContactParams): Promise<SubmitContactResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_GOLDEN_TICKET_API_URL}/golden-ticket/submit-contact`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          contact,
          signature,
          timestamp,
        }),
      },
    );

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error submitting contact:', error);
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: 'An unknown error occurred',
    };
  }
}
