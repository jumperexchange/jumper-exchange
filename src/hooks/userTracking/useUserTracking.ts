'use client';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useAccounts } from '@/hooks/useAccounts';
import { useJumperTracking } from '@/hooks/useJumperTracking';
import { useSession } from '@/hooks/useSession';
import type {
  TrackEventProps,
  TrackTransactionDataProps,
  TrackTransactionProps,
} from '@/types/userTracking';
import { EventTrackingTool } from '@/types/userTracking';
import type { Theme } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useCallback, useEffect } from 'react';

const googleEvent = ({
  action,
  category,
  data,
}: {
  action: string;
  category: string;
  data?:
    | TrackTransactionDataProps
    | { [key: string]: string | number | boolean };
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
  data: any;
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
  const { account } = useAccounts();
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const sessionId = useSession();
  const {
    trackEvent: jumperTrackEvent,
    trackTransaction: jumperTrackTransaction,
  } = useJumperTracking();

  useEffect(() => {
    if (account?.chainId) {
      typeof window !== 'undefined' &&
        window?.gtag('event', TrackingAction.SwitchChain, {
          category: TrackingCategory.Wallet,
          [TrackingEventParameter.SwitchedChain]: account?.chainId,
        });
    }
  }, [account, account?.chainId]);

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
      }
      if (!disableTrackingTool?.includes(EventTrackingTool.JumperTracking)) {
        try {
          const eventData = {
            category,
            value: typeof value === 'number' ? value : 0,
            action,
            label,
            data: data,
            isConnected: account?.isConnected,
            walletAddress: account?.address,
            browserFingerprint: undefined,
            isMobile: !isDesktop,
            sessionId,
          };
          await jumperTrackEvent(eventData);
        } catch (error) {
          console.error('Error in tracking event:', error);
        }
      }
    },
    [
      account?.address,
      account?.isConnected,
      isDesktop,
      jumperTrackEvent,
      sessionId,
    ],
  );

  const trackTransaction = useCallback(
    /**
     * Track Transaction with GA, HJ and ARCx
     *
     */
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
          sessionId,
          wallet: account?.address,
          type: data[TrackingEventParameter.Type],
          routeId: data[TrackingEventParameter.RouteId],
          transactionHash:
            data[TrackingEventParameter.TransactionHash] || undefined,
          transactionStatus: data[TrackingEventParameter.Status],
          transactionId: data[TrackingEventParameter.TransactionId],
          fromChainId: data[TrackingEventParameter.FromChainId],
          toChainId: data[TrackingEventParameter.ToChainId],
          fromToken: data[TrackingEventParameter.FromToken],
          toToken: data[TrackingEventParameter.ToToken],
          exchange: data[TrackingEventParameter.Exchange],
          stepNumber: data[TrackingEventParameter.StepNumber],
          isFinal: data[TrackingEventParameter.IsFinal],
          gasCost: data[TrackingEventParameter.GasCost],
          gasCostUSD: data[TrackingEventParameter.GasCostUSD],
          fromAmount: data[TrackingEventParameter.FromAmount],
          fromAmountUSD: data[TrackingEventParameter.FromAmountUSD],
          toAmount: data[TrackingEventParameter.ToAmountUSD],
          toAmountUSD: data[TrackingEventParameter.ToAmount],
          errorCode: data[TrackingEventParameter.ErrorCode],
          errorMessage: data[TrackingEventParameter.ErrorMessage],
          action: data[TrackingEventParameter.Action],
          // transactionLink: data[TrackingEventParameter.TransactionLink],
          // insuranceState: data[TrackingEventParameter.InsuranceState],
          // insuranceFeeAmountUSD:
          //   data[TrackingEventParameter.InsuranceFeeAmountUSD],
        };
        console.log('transactionData test', transactionData);
        await jumperTrackTransaction(transactionData);
      }

      if (enableAddressable) {
        addressableEvent({
          action,
          label: 'transaction',
          data,
          isConversion: true,
        });
      }
    },
    [account?.address, jumperTrackTransaction, sessionId],
  );

  return {
    trackEvent,
    trackTransaction,
  };
}
