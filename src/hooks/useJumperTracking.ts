'use client';

import * as Sentry from '@sentry/nextjs';

import {
  JUMPER_ANALYTICS_EVENT,
  JUMPER_ANALYTICS_TRANSACTION,
} from 'src/const/abi/jumperApiUrls';
interface JumperDataTrackEventProps {
  action: string;
  browserFingerprint: string;
  category: string;
  data?: { [key: string]: string | number | boolean };
  isConnected: boolean;
  isMobile: boolean;
  label: string;
  sessionId: string;
  url: string;
  value: number;
  walletAddress?: string;
  walletProvider?: string;
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
  action: string;
  browserFingerprint: string;
  errorCode?: string | number;
  errorMessage?: string;
  exchange?: string;
  fromAmount: number;
  fromAmountUSD?: number;
  fromChainId: number;
  fromToken: string;
  gasCost?: number;
  gasCostUSD?: number;
  integrator?: string;
  isFinal: boolean;
  pathname?: string;
  routeId: string;
  sessionId: string;
  stepNumber?: number;
  toAmount: number;
  toAmountUSD?: number;
  toChainId: number;
  toToken: string;
  transactionHash?: string;
  transactionStatus: string;
  type: string;
  url: string;
  walletAddress?: string;
  walletProvider?: string;
}

export const useJumperTracking = () => {
  const trackEvent = async (data: JumperDataTrackEventProps) => {
    await track(
      {
        action: data.action,
        browserFingerprint: data.browserFingerprint,
        category: data.category,
        data: data.data,
        isConnected: data.isConnected,
        isMobile: data.isMobile,
        label: data.label,
        sessionId: data.sessionId,
        url: data.url,
        value: data.value,
        walletAddress: data.walletAddress,
        walletProvider: data.walletProvider,
      },
      JUMPER_ANALYTICS_EVENT,
    );
  };

  const trackTransaction = async (data: JumperDataTrackTransactionProps) => {
    const transactionData = {
      action: data.action,
      browserFingerprint: data.browserFingerprint,
      errorCode: data.errorCode,
      errorMessage: data.errorMessage,
      exchange: data.exchange,
      fromAmount: data.fromAmount,
      fromAmountUSD: data.fromAmountUSD,
      fromChainId: data.fromChainId,
      fromToken: data.fromToken,
      gasCost: data.gasCost,
      gasCostUSD: data.gasCostUSD,
      integrator: data.integrator,
      isFinal: data.isFinal,
      pathname: data.pathname,
      routeId: data.routeId,
      sessionId: data.sessionId,
      stepNumber: data.stepNumber,
      toAmount: data.toAmount,
      toAmountUSD: data.toAmountUSD,
      toChainId: data.toChainId,
      toToken: data.toToken,
      transactionHash: data.transactionHash,
      transactionStatus: data.transactionStatus,
      type: data.type,
      url: data.url,
      walletProvider: data.walletProvider,
      walletAddress: data.walletAddress,
    };
    await track(transactionData, JUMPER_ANALYTICS_TRANSACTION);
  };

  return { trackTransaction, trackEvent };
};
