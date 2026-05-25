import { captureException } from '@sentry/nextjs';

import type { AbTestVariants } from 'src/const/abtests';
import type { TransformedRoute } from 'src/types/internal';
import config from '@/config/env-config';
import { JumperBackendApiPaths } from '@/const/urls';

export type JumperEventData = {
  [key: string]:
    | string
    | number
    | boolean
    | Record<number, TransformedRoute>
    | AbTestVariants;
} & {
  abTestVariants?: AbTestVariants;
};

interface JumperTrackingBaseProps {
  action: string;
  browserFingerprint: string;
  referrer?: string;
  sessionId: string;
  url: string;
  walletAddress?: string;
  walletProvider?: string;
  abtests?: { [key: string]: boolean };
  abTestVariants?: AbTestVariants;
}

interface JumperDataTrackEventProps extends JumperTrackingBaseProps {
  category: string;
  data?: JumperEventData;
  isConnected: boolean;
  isMobile: boolean;
  label: string;
  value: number;
}

export type JumperDataTrackTransactionProps = JumperTrackingBaseProps & {
  walletAddress: string;
  errorCode?: string | number;
  errorCodeKey?: string;
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
  routeId: string;
  stepNumber?: number;
  toAmount: number;
  toAmountMin?: number;
  toAmountUSD?: number;
  toChainId: number;
  toToken: string;
  transactionHash?: string;
  transactionStatus: string;
  type: string;
  feeCost?: number;
  feeCostFormatted?: string;
  feeCostUSD?: number;
  lastStepAction?: string;
  message?: string;
  nbOfSteps?: number;
  slippage?: number;
  maxSlippage?: string;
  status?: string;
  stepIds?: string;
  steps?: string;
  tags?: string;
  time?: number;
  toAmountFormatted?: string;
  transactionId?: string;
  transactionLink?: string;
  tokenCount?: number;
};

const track = async (data: object, path: string) => {
  const backendUrl = config.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) {
    return;
  }

  try {
    const url = `${backendUrl}${path}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(
        `Tracking request failed: ${response.status} ${response.statusText || '(no status text)'} - ${url}`,
      );
    }
  } catch (error) {
    console.error(error);
    captureException(error);
  }
};

export const trackJumperEvent = (
  data: JumperDataTrackEventProps,
): Promise<void> => track(data, JumperBackendApiPaths.GetUserTracking);

export const trackJumperTransaction = (
  data: JumperDataTrackTransactionProps,
): Promise<void> => track(data, JumperBackendApiPaths.GetUserTransactions);
