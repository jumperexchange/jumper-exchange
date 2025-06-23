'use client';

import * as Sentry from '@sentry/nextjs';

import {
  JUMPER_ANALYTICS_EVENT,
  JUMPER_ANALYTICS_TRANSACTION,
} from 'src/const/abi/jumperApiUrls';
import type { TransformedRoute } from 'src/types/internal';

export type JumperEventData = {
  [key: string]: string | number | boolean | Record<number, TransformedRoute>;
};

interface JumperDataTrackEventProps {
  action: string;
  browserFingerprint: string;
  category: string;
  data?: JumperEventData;
  isConnected: boolean;
  isMobile: boolean;
  label: string;
  sessionId: string;
  url: string;
  value: number;
  walletAddress?: string;
  walletProvider?: string;
  referrer?: string;
  abtests?: { [key: string]: boolean }; // Add this line
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
  abtests?: { [key: string]: boolean };
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
  gasCostFormatted?: string;
  gasCostUSD?: number;
  integrator?: string;
  isFinal: boolean;
  pathname?: string;
  referrer?: string;
  routeId: string;
  sessionId: string;
  stepNumber?: number;
  toAmount: number;
  toAmountMin?: number;
  toAmountUSD?: number;
  toChainId: number;
  toToken: string;
  transactionHash?: string;
  transactionStatus: string;
  type: string;
  url: string;
  walletAddress: string;
  walletProvider?: string;

  // Additional tracking parameters
  feeCost?: number;
  feeCostFormatted?: string;
  feeCostUSD?: number;
  lastStepAction?: string;
  message?: string;
  nbOfSteps?: number;
  slippage?: number;
  status?: string;
  stepIds?: string;
  steps?: string;
  tags?: string;
  time?: number;
  toAmountFormatted?: string;
  transactionId?: string;
  transactionLink?: string;
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
        referrer: data.referrer,
        abtests: data.abtests,
      },
      JUMPER_ANALYTICS_EVENT,
    );
  };

  const trackTransaction = async (data: JumperDataTrackTransactionProps) => {
    const transactionData = {
      abtests: data.abtests,
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
      referrer: data.referrer,
      routeId: data.routeId,
      sessionId: data.sessionId,
      stepNumber: data.stepNumber,
      tags: data.tags,
      toAmount: data.toAmount,
      toAmountMin: data.toAmountMin,
      toAmountUSD: data.toAmountUSD,
      toChainId: data.toChainId,
      toToken: data.toToken,
      transactionHash: data.transactionHash,
      transactionStatus: data.transactionStatus,
      type: data.type,
      url: data.url,
      walletAddress: data.walletAddress,
      walletProvider: data.walletProvider,

      // Additional tracking parameters - only add if they exist
      ...(data.feeCost && { feeCost: data.feeCost }),
      ...(data.feeCostUSD && { feeCostUSD: data.feeCostUSD }),
      ...(data.feeCostFormatted && { feeCostFormatted: data.feeCostFormatted }),
      ...(data.gasCost && { gasCost: data.gasCost }),
      ...(data.gasCostFormatted && { gasCostFormatted: data.gasCostFormatted }),
      ...(data.gasCostUSD && { gasCostUSD: data.gasCostUSD }),
      ...(data.lastStepAction && { lastStepAction: data.lastStepAction }),
      ...(data.message && { message: data.message }),
      ...(data.nbOfSteps && { nbOfSteps: data.nbOfSteps }),
      ...(data.slippage && { slippage: data.slippage }),
      ...(data.status && { status: data.status }),
      ...(data.stepIds && { stepIds: data.stepIds }),
      ...(data.steps && { steps: data.steps }),
      ...(data.time && { time: data.time }),
      ...(data.toAmountFormatted && {
        toAmountFormatted: data.toAmountFormatted,
      }),
      ...(data.transactionId && { transactionId: data.transactionId }),
      ...(data.transactionLink && { transactionLink: data.transactionLink }),
    };
    await track(transactionData, JUMPER_ANALYTICS_TRANSACTION);
  };

  return { trackTransaction, trackEvent };
};
