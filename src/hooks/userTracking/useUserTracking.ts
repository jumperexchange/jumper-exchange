'use client';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useAccounts } from '@/hooks/useAccounts';
import type {
  TrackAttributeProps,
  TrackChainSwitchProps,
  TrackConnectWalletProps,
  TrackDisconnectWalletProps,
  TrackEventProps,
  TrackTransactionProps,
  trackPageloadProps,
} from '@/types/userTracking';
import { EventTrackingTool } from '@/types/userTracking';
import { useCallback, useEffect } from 'react';

export function useUserTracking() {
  const { account } = useAccounts();

  useEffect(() => {
    if (account?.chainId) {
      typeof window !== 'undefined' &&
        window?.gtag('event', TrackingAction.SwitchChain, {
          category: TrackingCategory.Wallet,
          [TrackingEventParameter.SwitchedChain]: account?.chainId,
        });
    }
  }, [account, account?.chainId]);

  const trackConnectWallet = useCallback(
    /**
     * Track Wallet Connect with HJ, GA and ARCx
     *
     */

    ({ walletName, chainType, chainId, address }: TrackConnectWalletProps) => {
      typeof window !== 'undefined' &&
        window?.gtag('event', TrackingAction.ConnectWallet, {
          [TrackingEventParameter.Wallet]: walletName,
          [TrackingEventParameter.Ecosystem]: chainType,
        });
    },
    [],
  );

  const trackAttribute = useCallback(
    /**
     * Track Attributes with GA, HJ and ARCx
     *
     */
    async ({ data, disableTrackingTool }: TrackAttributeProps) => {
      if (data && !disableTrackingTool?.includes(EventTrackingTool.GA)) {
        data &&
          typeof window !== 'undefined' &&
          window?.gtag('set', 'user_properties', data);
      }
    },
    [],
  );

  const trackDisconnectWallet = useCallback(
    ({ data, disableTrackingTool }: TrackDisconnectWalletProps) => {
      if (!disableTrackingTool?.includes(EventTrackingTool.GA)) {
        typeof window !== 'undefined' &&
          window?.gtag('event', TrackingAction.DisconnectWallet, {
            ...data,
          });
      }
    },
    [],
  );

  const trackEvent = useCallback(
    async ({
      action,
      category,
      label,
      value,
      data,
      disableTrackingTool,
      enableAddressable,
      isConversion,
    }: TrackEventProps) => {
      if (!disableTrackingTool?.includes(EventTrackingTool.GA)) {
        typeof window !== 'undefined' &&
          window?.gtag('event', action, {
            category: category,
            ...data,
          });
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
                name: key,
                value,
              })),
            ),
          );
      }
    },
    [],
  );

  const trackPageload = useCallback(
    /**
     * Track PageLoad with GA, HJ and ARCx
     *
     */
    async ({
      destination,
      source,
      data,
      pageload, // requires page load? -> true
      disableTrackingTool,
      url,
    }: trackPageloadProps) => {
      if (!disableTrackingTool?.includes(EventTrackingTool.GA)) {
        typeof window !== 'undefined' &&
          window?.gtag('event', TrackingAction.PageLoad, {
            category: pageload ? 'external' : 'internal',
            url,
            source,
            destination,
            ...data,
          });
      }
    },
    [],
  );

  const trackTransaction = useCallback(
    /**
     * Track Transaction with GA, HJ and ARCx
     *
     */
    async ({
      action,
      category,
      value,
      data,
      disableTrackingTool,
      txhash,
    }: TrackTransactionProps) => {
      if (!disableTrackingTool?.includes(EventTrackingTool.GA)) {
        typeof window !== 'undefined' &&
          window?.gtag('event', action, {
            category,
            ...data,
          });
      }
    },
    [],
  );

  const trackChainSwitch = useCallback(
    async ({
      account,
      disableTrackingTool,
      action,
      category,
      data,
    }: TrackChainSwitchProps) => {
      if (!disableTrackingTool?.includes(EventTrackingTool.GA)) {
        typeof window !== 'undefined' &&
          window?.gtag('event', action, {
            category: category,
            ...data,
          });
      }
    },
    [],
  );

  return {
    trackAttribute,
    trackDisconnectWallet,
    trackConnectWallet,
    trackEvent,
    trackPageload,
    trackTransaction,
    trackChainSwitch,
  };
}
