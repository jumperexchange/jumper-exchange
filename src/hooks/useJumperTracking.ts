import {
  JUMPER_ANALYTICS_EVENT,
  JUMPER_ANALYTICS_TRANSACTION,
} from 'src/const/urls';

interface JumperDataTrackEventProps {
  category: string;
  action: string;
  label: string;
  value: string;
  data?: { [key: string]: string | number | boolean };
  isConnected?: boolean;
  walletAddress?: string;
  browserFingerprint?: string;
  isMobile: boolean;
  sessionId?: string;
}

export interface JumperDataTrackTransactionProps {
  sessionId?: string;
  wallet?: string;
  type?: string;
  transactionHash?: string;
  transactionStatus?: string;
  fromChainId?: number;
  toChainId?: number;
  fromToken?: string;
  toToken?: string;
  exchange?: string;
  stepNumber?: number;
  isFinal: boolean;
  integrator: string;
  gasCost?: string;
  gasCostUSD?: string;
  fromAmount?: string;
  fromAmountUSD?: string;
  toAmount?: string;
  toAmountUSD?: string;
  routeId: string;
  errorCode?: string | number;
  errorMessage?: string;
}

export const useJumperTracking = () => {
  const trackEvent = async (data: JumperDataTrackEventProps) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_JUMPER_API}${JUMPER_ANALYTICS_EVENT}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: data.category,
          action: data.action,
          label: data.label,
          value: data.label,
          data: data.data,
          walletAddress: data.walletAddress,
          browserFingerprint: 'test fingerprint',
          isMobile: false,
        }),
      },
    );

    if (response) {
      const result = await response.json();
      console.log(result);
    }
  };

  const trackTransaction = async (data: JumperDataTrackTransactionProps) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_JUMPER_API}${JUMPER_ANALYTICS_TRANSACTION}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: data.wallet,
          sessionId: data.sessionId,
          integrator: data.integrator,
          type: data.type,
          // transactionId: data.transactionId,
          // transactionStatus: data.status,
          fromChain: data.fromChainId,
          toChain: data.toChainId,
          fromToken: data.fromToken,
          toToken: data.toToken,
          exchange: data.exchange,
          stepNumber: data.stepNumber,
          isFinal: data.isFinal,
          gasCost: data.gasCost,
          gasCostUSD: data.gasCostUSD,
          fromAmount: data.fromAmount,
          toAmount: data.toAmount,
        }),
      },
    );

    const result = await response.json();
    console.log(result);
  };

  return { trackTransaction, trackEvent };
};
