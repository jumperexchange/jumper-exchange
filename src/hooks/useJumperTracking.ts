'use client';

import { useAccount } from '@lifi/widget';
import * as Sentry from '@sentry/nextjs';

import {
  JUMPER_ANALYTICS_EVENT,
  JUMPER_ANALYTICS_TRANSACTION,
} from 'src/const/abi/jumperApiUrls';
interface JumperDataTrackEventProps {
  category: string;
  action: string;
  label: string;
  url: string;
  value: number;
  data?: { [key: string]: string | number | boolean };
  isConnected: boolean;
  walletAddress?: string;
  browserFingerprint: string;
  walletProvider?: string;
  sessionId: string;
  isMobile: boolean;
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
    if (!response.ok) {
      throw new Error(response.statusText);
    }
  } catch (error) {
    console.error(error);
    Sentry.captureException(error);
  }
};
export interface JumperDataTrackTransactionProps {
  sessionId: string;
  type: string;
  action: string;
  transactionHash?: string;
  transactionStatus: string;
  fromChainId: number;
  toChainId: number;
  fromToken: string;
  toToken: string;
  exchange?: string;
  stepNumber?: number;
  integrator?: string;
  isFinal: boolean;
  gasCost?: number;
  gasCostUSD?: number;
  fromAmount: number;
  fromAmountUSD?: number;
  toAmount: number;
  toAmountUSD?: number;
  routeId: string;
  errorCode?: string | number;
  errorMessage?: string;
  pathname?: string;
  url: string;
  browserFingerprint: string;
}

export const useJumperTracking = () => {
  const account = useAccount();
  const trackEvent = async (data: JumperDataTrackEventProps) => {
    await track(
      {
        category: data.category,
        action: data.action,
        label: data.label,
        value: data.value,
        isConnected: data.isConnected,
        sessionId: data.sessionId,
        data: data.data,
        walletProvider: account?.account.connector?.name,
        walletAddress: data.walletAddress,
        browserFingerprint: data.browserFingerprint,
        isMobile: data.isMobile,
        url: data.url,
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
      exchange: data.exchange,
      transactionStatus: data.transactionStatus,
      isFinal: data.isFinal,
      gasCost: data.gasCost,
      gasCostUSD: data.gasCostUSD,
      fromAmountUSD: data.fromAmountUSD,
      toAmountUSD: data.toAmountUSD,
      fromAmount: data.fromAmount,
      fromChainId: data.fromChainId,
      toAmount: data.toAmount,
      toChainId: data.toChainId,
      transactionHash: data.transactionHash,
      wallet: account?.account.address,
      walletProvider: account?.account.connector?.name,
      errorMessage: data.errorMessage,
      errorCode: data.errorCode,
      pathname: data.pathname,
      url: data.url,
      browserFingerprint: data.browserFingerprint,
    };
    await track(transactionData, JUMPER_ANALYTICS_TRANSACTION);
  };

  return { trackTransaction, trackEvent };
};
