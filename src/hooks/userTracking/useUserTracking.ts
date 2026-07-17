'use client';
import { isObject, mapValues } from 'lodash';
import { getSiteUrl } from '@/const/urls';
import type { JumperEventData } from '@/utils/tracking/jumperTracking';
import {
  trackJumperEvent,
  trackJumperTransaction,
} from '@/utils/tracking/jumperTracking';
import { useSession } from '@/hooks/useSession';
import type {
  TrackEventProps,
  TrackTransactionDataProps,
  TrackTransactionProps,
} from '@/types/userTracking';
import { EventTrackingTool } from '@/types/userTracking';
import { useAccount } from '@jumperexchange/wallet-management';
import type { Theme } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useCallback, useMemo } from 'react';
import { TrackingEventParameter } from 'src/const/trackingKeys';
import { useAbTestsStore } from 'src/stores/abTests';
import { useFeatureFlags } from 'src/hooks/useFeatureFlags';
import type { TransformedRoute } from 'src/types/internal';
import { useFingerprint } from '../useFingerprint';

const googleEvent = ({
  action,
  category,
  data,
}: {
  action: string;
  category: string;
  data?:
    | TrackTransactionDataProps
    | {
        [key: string]:
          | string
          | number
          | boolean
          | Record<number, TransformedRoute>;
      };
}) => {
  if (typeof window === 'undefined') {
    return;
  }
  const serialized = data
    ? mapValues(data, (v) => (isObject(v) ? JSON.stringify(v) : v))
    : undefined;
  window?.gtag('event', action, {
    category: category,
    ...serialized,
  });
};

const addressableEvent = ({
  action,
  label,
  data,
  isConversion,
}: {
  action: string;
  label: string;
  data: TrackTransactionDataProps | JumperEventData;
  isConversion?: boolean;
}) => {
  const dataArray = [];
  if (label) {
    dataArray.push({ name: 'label', value: label });
  }

  typeof window !== 'undefined' &&
    data &&
    window.__adrsbl?.run(
      action,
      isConversion ?? false,
      dataArray.concat(
        Object.entries(data).map(([key, value]) => ({
          name: `${key}`,
          value: `${value}`,
        })),
      ),
    );
};

function buildTransactionPayload(data: TrackTransactionDataProps) {
  return {
    errorCode: data[TrackingEventParameter.ErrorCode],
    errorCodeKey: data[TrackingEventParameter.ErrorCodeKey],
    errorMessage: data[TrackingEventParameter.ErrorMessage],
    exchange: data[TrackingEventParameter.Exchange],
    feeCost: data[TrackingEventParameter.FeeCost],
    feeCostFormatted: data[TrackingEventParameter.FeeCostFormatted],
    feeCostUSD: data[TrackingEventParameter.FeeCostUSD],
    fromAmount: Number(data[TrackingEventParameter.FromAmount] ?? 0),
    fromAmountUSD: Number(data[TrackingEventParameter.FromAmountUSD] ?? 0),
    fromChainId: data[TrackingEventParameter.FromChainId],
    fromToken: data[TrackingEventParameter.FromToken],
    gasCost: data[TrackingEventParameter.GasCost],
    gasCostFormatted: data[TrackingEventParameter.GasCostFormatted],
    gasCostUSD: Number(data[TrackingEventParameter.GasCostUSD] ?? 0),
    integrator: data[TrackingEventParameter.Integrator],
    isFinal: data[TrackingEventParameter.IsFinal],
    lastStepAction: data[TrackingEventParameter.LastStepAction],
    message: data[TrackingEventParameter.Message],
    nbOfSteps: data[TrackingEventParameter.NbOfSteps],
    routeId: data[TrackingEventParameter.RouteId],
    slippage: data[TrackingEventParameter.Slippage],
    maxSlippage: data[TrackingEventParameter.MaxSlippage],
    status: data[TrackingEventParameter.Status],
    stepIds: data[TrackingEventParameter.StepIds],
    steps: data[TrackingEventParameter.Steps],
    tags: data[TrackingEventParameter.Tags],
    time: data[TrackingEventParameter.Time],
    toAmount: Number(data[TrackingEventParameter.ToAmount] ?? 0),
    toAmountFormatted: data[TrackingEventParameter.ToAmountFormatted],
    toAmountMin: Number(data[TrackingEventParameter.ToAmountMin] ?? 0),
    toAmountUSD: Number(data[TrackingEventParameter.ToAmountUSD] ?? 0),
    toChainId: data[TrackingEventParameter.ToChainId],
    toToken: data[TrackingEventParameter.ToToken],
    transactionHash: data[TrackingEventParameter.TransactionHash],
    transactionId: data[TrackingEventParameter.TransactionId],
    transactionLink: data[TrackingEventParameter.TransactionLink],
    transactionStatus: data[TrackingEventParameter.TransactionStatus],
    type: data[TrackingEventParameter.Type],
    tokenCount: data[TrackingEventParameter.TokenCount],
  };
}

export interface UserTracking {
  trackEvent: (event: TrackEventProps) => Promise<void>;
  trackTransaction: (transaction: TrackTransactionProps) => Promise<void>;
}

export function useUserTracking(): UserTracking {
  const { account } = useAccount();
  const isDesktop = useMediaQuery(
    (theme: Theme) => theme?.breakpoints.up('md') || '0',
    { noSsr: true },
  );
  const sessionId = useSession();
  const fp = useFingerprint();
  const { activeAbTests } = useAbTestsStore();
  const { data: featureFlags } = useFeatureFlags();

  const sessionContext = useMemo(
    () => ({
      browserFingerprint: fp || 'unknown',
      walletAddress: account.address || 'not_connected',
      walletProvider: account.connector?.name,
      sessionId: sessionId || 'unknown',
      abtests: activeAbTests,
    }),
    [fp, account.address, account.connector?.name, sessionId, activeAbTests],
  );

  const getFeatureFlagVariants = useCallback(
    (eventName: string): Record<string, string | boolean> => {
      const matching = (featureFlags ?? []).filter(
        (f) => !f.events?.length || f.events.includes(eventName),
      );
      return matching.reduce<Record<string, string | boolean>>(
        (acc, f) => ({
          ...acc,
          [f.key]: f.variant as unknown as string | boolean,
        }),
        {},
      );
    },
    [featureFlags],
  );

  const trackEvent = useCallback(
    async ({
      action,
      category,
      label,
      data,
      value,
      disableTrackingTool,
      enableAddressable,
      isConversion,
    }: TrackEventProps) => {
      if (!disableTrackingTool?.includes(EventTrackingTool.GA)) {
        googleEvent({ action, category, data });
      }
      if (enableAddressable) {
        addressableEvent({ action, label, data: data || {}, isConversion });
      }
      if (!disableTrackingTool?.includes(EventTrackingTool.JumperTracking)) {
        try {
          const flagVariants = getFeatureFlagVariants(action);
          await trackJumperEvent({
            ...sessionContext,
            action,
            category,
            label,
            data: data || {},
            value: typeof value === 'number' ? value : 0,
            isConnected: account.isConnected || false,
            isMobile: !isDesktop,
            referrer: document?.referrer,
            url: window?.location?.href || getSiteUrl(),
            ...(Object.keys(flagVariants).length > 0 && {
              abTestVariants: flagVariants,
            }),
          });
        } catch (error) {
          console.error('Error in tracking event:', error);
        }
      }
    },
    [sessionContext, account.isConnected, isDesktop, getFeatureFlagVariants],
  );

  const trackTransaction = useCallback(
    async ({
      data,
      action,
      category,
      disableTrackingTool,
      enableAddressable,
    }: TrackTransactionProps) => {
      if (!disableTrackingTool?.includes(EventTrackingTool.GA)) {
        googleEvent({ action, category, data });
      }
      if (!disableTrackingTool?.includes(EventTrackingTool.JumperTracking)) {
        try {
          const dataAction =
            data[TrackingEventParameter.Action] ?? action ?? '';
          const flagVariants = getFeatureFlagVariants(dataAction);
          await trackJumperTransaction({
            ...sessionContext,
            ...buildTransactionPayload(data),
            action: dataAction,
            url: window?.location?.href || getSiteUrl(),
            referrer: document?.referrer,
            abTestVariants: { ...data.abTestVariants, ...flagVariants },
          });
        } catch (error) {
          console.error('Error in tracking transaction:', error);
        }
      }
      if (enableAddressable) {
        addressableEvent({
          action,
          label: 'transaction',
          data: data || {},
          isConversion: true,
        });
      }
    },
    [sessionContext, getFeatureFlagVariants],
  );

  return {
    trackEvent,
    trackTransaction,
  };
}
