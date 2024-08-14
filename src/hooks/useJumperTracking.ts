'use client';
import { usePathname } from 'next/navigation';

import {
  JUMPER_ANALYTICS_EVENT,
  JUMPER_ANALYTICS_TRANSACTION,
} from 'src/const/abi/jumperApiUrls';
import { useFingerprint } from './useFingerprint';
interface JumperDataTrackEventProps {
  category: string;
  action: string;
  label: string;
  value?: number;
  data?: { [key: string]: string | number | boolean };
  isConnected?: boolean;
  walletAddress?: string;
  browserFingerprint?: string;
  isMobile: boolean;
  sessionId?: string;
}

const track = async (data: object, path: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
    );
    if (!response.ok && process.env.MODE !== 'production') {
      console.error('Tracking failed', response.statusText);
    }
  } catch (error) {
    if (process.env.MODE === 'development') {
      console.error('Tracking error', error);
    }
  }
};

export interface JumperDataTrackTransactionProps {
  sessionId?: string;
  wallet: string;
  type?: string;
  action: string;
  transactionHash?: string;
  transactionStatus?: string;
  fromChainId?: number;
  toChainId?: number;
  fromToken?: string;
  toToken?: string;
  exchange?: string;
  stepNumber?: number;
  integrator?: string;
  isFinal: boolean;
  gasCost?: number;
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
  const pathname = usePathname();
  const fp = useFingerprint();
  const trackEvent = async (data: JumperDataTrackEventProps) => {
    await track(
      {
        category: data.category,
        action: data.action,
        label: data.label,
        value: data.value,
        isConnected: data.isConnected,
        sessionId: data.sessionId,
        data: data.data || {},
        walletAddress: data.walletAddress || '',
        browserFingerprint: fp,
        isMobile: data.isMobile,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}${pathname}`,
      },
      JUMPER_ANALYTICS_EVENT,
    );
  };

  const trackTransaction = async (data: JumperDataTrackTransactionProps) => {
    const transactionData = {
      sessionId: data.sessionId,
      routeId: data.routeId,
      integrator: data.integrator,
      action: data.action,
      type: data.type,
      fromToken: data.fromToken,
      toToken: data.toToken,
      stepNumber: data.stepNumber,
      exchange: data.exchange || 'unknown',
      transactionStatus: data.transactionStatus,
      isFinal: data.isFinal,
      gasCost: data.gasCost || 0,
      gasCostUSD: (data.gasCostUSD && parseFloat(data.gasCostUSD)) || 0,
      fromAmountUSD:
        (data.fromAmountUSD && parseFloat(data.fromAmountUSD)) || undefined,
      toAmountUSD:
        (data.toAmountUSD && parseFloat(data.toAmountUSD)) || undefined,
      fromAmount: (data.fromAmount && parseFloat(data.fromAmount)) || undefined,
      fromChainId: data.fromChainId,
      toAmount: data.toAmount && parseFloat(data.toAmount),
      toChainId: data.toChainId,
      transactionHash: data.transactionHash || '',
      wallet: data.wallet,
    };
    await track(transactionData, JUMPER_ANALYTICS_TRANSACTION);
  };

  return { trackTransaction, trackEvent };
};
