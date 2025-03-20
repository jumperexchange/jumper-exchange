'use client';
import { TrackingEventParameter } from '@/const/trackingKeys';
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
  const { activeTests } = useAbTestsStore();

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
            abtests: activeTests,
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
      activeTests,
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
        const transactionData = {
          sessionId: sessionId || '',
          type: data[TrackingEventParameter.Type] || '',
          routeId: data[TrackingEventParameter.RouteId] || '',
          transactionHash: data[TrackingEventParameter.TransactionHash] || '',
          transactionStatus:
            data[TrackingEventParameter.TransactionStatus] || '',
          transactionId: data[TrackingEventParameter.TransactionId],
          fromChainId: data[TrackingEventParameter.FromChainId] || 0,
          toChainId: data[TrackingEventParameter.ToChainId] || 0,
          integrator: data[TrackingEventParameter.Integrator],
          fromToken: data[TrackingEventParameter.FromToken] || 'unknown',
          toToken: data[TrackingEventParameter.ToToken] || 'unknown',
          exchange: data[TrackingEventParameter.Exchange],
          stepNumber: data[TrackingEventParameter.StepNumber],
          isFinal: data[TrackingEventParameter.IsFinal] || false,
          gasCost: data[TrackingEventParameter.GasCost] || 0,
          gasCostUSD:
            (data[TrackingEventParameter.GasCostUSD] &&
              parseFloat(data[TrackingEventParameter.GasCostUSD])) ||
            0,
          fromAmount:
            (data[TrackingEventParameter.FromAmount] &&
              parseFloat(data[TrackingEventParameter.FromAmount])) ||
            0,
          fromAmountUSD:
            (data[TrackingEventParameter.FromAmountUSD] &&
              parseFloat(data[TrackingEventParameter.FromAmountUSD])) ||
            0,
          toAmount:
            (data[TrackingEventParameter.ToAmount] &&
              parseFloat(data[TrackingEventParameter.ToAmount])) ||
            0,
          toAmountUSD:
            (data[TrackingEventParameter.ToAmountUSD] &&
              parseFloat(data[TrackingEventParameter.ToAmountUSD])) ||
            0,
          errorCode: data[TrackingEventParameter.ErrorCode],
          errorMessage: data[TrackingEventParameter.ErrorMessage],
          action: data[TrackingEventParameter.Action] || '',
          url: window?.location?.href || getSiteUrl(),
          browserFingerprint: fp || 'unknown',
          walletAddress: account.address || 'not_connected',
          walletProvider: account.connector?.name,
          referrer: document?.referrer,
          abtests: activeTests,
        };
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
      activeTests,
    ],
  );

  return {
    trackEvent,
    trackTransaction,
  };
}
