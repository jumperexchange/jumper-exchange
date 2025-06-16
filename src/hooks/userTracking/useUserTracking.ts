'use client';
import { getSiteUrl } from '@/const/urls';
import type { JumperEventData } from '@/hooks/useJumperTracking';
import { useJumperTracking } from '@/hooks/useJumperTracking';
import { useSession } from '@/hooks/useSession';
import type {
  TrackEventProps,
  TrackTransactionDataProps,
  TrackTransactionProps,
} from '@/types/userTracking';
import { EventTrackingTool } from '@/types/userTracking';
import { useAccount } from '@lifi/wallet-management';
import type { Theme } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useCallback } from 'react';
import { TrackingEventParameter } from 'src/const/trackingKeys';
import { useAbTestsStore } from 'src/stores/abTests';
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
  typeof window !== 'undefined' &&
    window?.gtag('event', action, {
      category: category,
      ...data,
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
    window.__adrsbl.run(
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

export function useUserTracking() {
  const { account } = useAccount();
  const isDesktop = useMediaQuery(
    (theme: Theme) => theme?.breakpoints.up('md') || '0',
    { noSsr: true },
  );
  const sessionId = useSession();
  const fp = useFingerprint();
  const { activeAbTests } = useAbTestsStore();

  const {
    trackEvent: jumperTrackEvent,
    trackTransaction: jumperTrackTransaction,
  } = useJumperTracking();

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
        const dataArray = [];
        if (label) {
          dataArray.push({ name: 'label', value: label });
        }

        addressableEvent({ action, label, data: data || {}, isConversion });
      }
      if (!disableTrackingTool?.includes(EventTrackingTool.JumperTracking)) {
        try {
          const eventData = {
            category,
            value: typeof value === 'number' ? value : 0,
            action,
            label,
            data: data || {},
            isConnected: account.isConnected || false,
            walletAddress: account.address || 'not_connected',
            walletProvider: account.connector?.name,
            browserFingerprint: fp || 'unknown',
            isMobile: !isDesktop,
            sessionId: sessionId || 'unknown',
            referrer: document?.referrer,
            url: window?.location?.href || getSiteUrl(),
            abtests: activeAbTests,
          };
          await jumperTrackEvent(eventData);
        } catch (error) {
          console.error('Error in tracking event:', error);
        }
      }
    },
    [
      account.address,
      account.connector?.name,
      account.isConnected,
      fp,
      isDesktop,
      jumperTrackEvent,
      sessionId,
      activeAbTests,
    ],
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
        console.log('DATA', data);
        const transactionData = {
          url: window?.location?.href || getSiteUrl(),
          browserFingerprint: fp || 'unknown',
          walletAddress: account.address || 'not_connected',
          walletProvider: account.connector?.name,
          referrer: document?.referrer,
          abtests: activeAbTests,
          // data from handleRouteTrackingData:
          action: data[TrackingEventParameter.Action] || '',
          errorCode: data[TrackingEventParameter.ErrorCode],
          errorMessage: data[TrackingEventParameter.ErrorMessage],
          exchange: data[TrackingEventParameter.Exchange],
          feeCost: data[TrackingEventParameter.FeeCost],
          feeCostFormatted: data[TrackingEventParameter.FeeCostFormatted],
          feeCostUSD: data[TrackingEventParameter.FeeCostUSD],
          fromAmount: Number(data[TrackingEventParameter.FromAmount]),
          fromAmountUSD: Number(data[TrackingEventParameter.FromAmountUSD]),
          fromChainId: data[TrackingEventParameter.FromChainId],
          fromToken: data[TrackingEventParameter.FromToken],
          gasCost: data[TrackingEventParameter.GasCost],
          gasCostFormatted: data[TrackingEventParameter.GasCostFormatted],
          gasCostUSD: Number(data[TrackingEventParameter.GasCostUSD]),
          integrator: data[TrackingEventParameter.Integrator],
          isFinal: data[TrackingEventParameter.IsFinal],
          lastStepAction: data[TrackingEventParameter.LastStepAction],
          message: data[TrackingEventParameter.Message],
          nbOfSteps: data[TrackingEventParameter.NbOfSteps],
          routeId: data[TrackingEventParameter.RouteId],
          sessionId: sessionId || '',
          slippage: data[TrackingEventParameter.Slippage],
          status: data[TrackingEventParameter.Status],
          stepIds: data[TrackingEventParameter.StepIds],
          steps: data[TrackingEventParameter.Steps],
          tags: data[TrackingEventParameter.Tags],
          time: data[TrackingEventParameter.Time],
          toAmount: Number(data[TrackingEventParameter.ToAmount]),
          toAmountFormatted: data[TrackingEventParameter.ToAmountFormatted],
          toAmountMin: Number(data[TrackingEventParameter.ToAmountMin]),
          toAmountUSD: Number(data[TrackingEventParameter.ToAmountUSD]),
          toChainId: data[TrackingEventParameter.ToChainId],
          toToken: data[TrackingEventParameter.ToToken],
          transactionHash: data[TrackingEventParameter.TransactionHash],
          transactionId: data[TrackingEventParameter.TransactionId],
          transactionLink: data[TrackingEventParameter.TransactionLink],
          transactionStatus: data[TrackingEventParameter.TransactionStatus],
          type: data[TrackingEventParameter.Type],
        };
        console.log('transactionData', transactionData);
        await jumperTrackTransaction(transactionData);
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
    [
      account.address,
      account.connector?.name,
      fp,
      jumperTrackTransaction,
      sessionId,
      activeAbTests,
    ],
  );

  return {
    trackEvent,
    trackTransaction,
  };
}
