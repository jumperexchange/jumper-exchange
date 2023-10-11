import { useArcxAnalytics } from '@arcxmoney/analytics';
import { useCallback, useEffect } from 'react';
import { hotjar } from 'react-hotjar';
import { TrackingAction, TrackingEventParameter } from '../../const';
import { useWallet } from '../../providers/WalletProvider';
import {
  EventTrackingTool,
  TrackAttributeProps,
  TrackDisconnectWalletProps,
  TrackEventProps,
  TrackTransactionProps,
  trackPageloadProps,
} from '../../types';
import { useCookie3 } from '../useCookie3';

export function useUserTracking() {
  const arcx = useArcxAnalytics();
  const cookie3 = useCookie3();
  const { account, usedWallet } = useWallet();

  /* 
  use useEffect depended on account to track wallet connects with account depended tracking software
  */
  useEffect(() => {
    if (account?.address && account?.chainId && usedWallet) {
      arcx?.connectWallet({
        account: `${account.address}`,
        chain: `${account.chainId}`,
      });
      hotjar.identify(account.address, {
        [TrackingEventParameter.Wallet]: usedWallet.name,
      });
      hotjar.initialized() && hotjar.event(TrackingAction.ConnectWallet);
    }
  }, [account, account.address, account.chainId, arcx, usedWallet]);

  const trackAttribute = useCallback(
    /**
     * Track Attributes with GA, HJ and ARCx
     *
     */
    async ({ data, disableTrackingTool }: TrackAttributeProps) => {
      if (
        !!account.address &&
        data &&
        !disableTrackingTool?.includes(EventTrackingTool.Hotjar)
      ) {
        hotjar.initialized() &&
          hotjar.identify(account.address, {
            ...data,
          });
      }
      if (data && !disableTrackingTool?.includes(EventTrackingTool.GA)) {
        data && window.gtag('set', 'user_properties', data);
      }
      if (data && !disableTrackingTool?.includes(EventTrackingTool.ARCx)) {
        await arcx?.attribute({
          ...data,
          //   source, // optional(string) - the origin of the web traffic (eg. discord, twitter etc)
          //   campaignId, // optional(string) - a specific identifier of the campaign (eg. bankless-5)
        });
      }
    },
    [account?.address, arcx],
  );

  const trackDisconnectWallet = useCallback(
    ({ data, disableTrackingTool }: TrackDisconnectWalletProps) => {
      if (
        account.address &&
        !disableTrackingTool?.includes(EventTrackingTool.Hotjar)
      ) {
        hotjar.identify(account.address, {
          ...data,
        });
        hotjar.initialized() && hotjar.event(TrackingAction.DisconnectWallet);
      }
      if (!disableTrackingTool?.includes(EventTrackingTool.GA)) {
        window.gtag('event', TrackingAction.DisconnectWallet, {
          ...data,
        });
      }
    },
    [account.address],
  );

  const trackEvent = useCallback(
    async ({
      action,
      category,
      label,
      data,
      disableTrackingTool,
    }: TrackEventProps) => {
      if (!disableTrackingTool?.includes(EventTrackingTool.Hotjar)) {
        hotjar.initialized() &&
          hotjar.event(`${action}-${category}-${label ?? '-' + label}`);
      }
      if (!disableTrackingTool?.includes(EventTrackingTool.GA)) {
        window.gtag('event', action, {
          category: category,
          ...data,
        });
      }
      if (!disableTrackingTool?.includes(EventTrackingTool.ARCx)) {
        arcx?.event(action, {
          category: category,
          ...data,
        });
      }
      if (
        !disableTrackingTool?.includes(EventTrackingTool.Cookie3) &&
        cookie3?.trackEvent({
          category,
          action,
          name: label,
          //value: todo add to trackingEventProps
        })
      ) {
      }
    },
    [arcx, cookie3],
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
      if (!disableTrackingTool?.includes(EventTrackingTool.Hotjar)) {
        hotjar.initialized() && pageload
          ? hotjar.stateChange(url)
          : hotjar.event(`pageload${destination && '-' + destination}`);
      }
      if (!disableTrackingTool?.includes(EventTrackingTool.GA)) {
        window.gtag('event', TrackingAction.PageLoad, {
          category: pageload ? 'external' : 'internal',
          url,
          source,
          destination,
          ...data,
        });
      }
      if (!disableTrackingTool?.includes(EventTrackingTool.ARCx)) {
        pageload &&
          arcx?.event(`pageload`, {
            url,
            source,
            destination,
            pageload: pageload ? 'external' : 'internal',
            ...data,
          });
      }
    },
    [arcx],
  );

  const trackTransaction = useCallback(
    /**
     * Track Transaction with GA, HJ and ARCx
     *
     */
    async ({
      action,
      category,
      chain,
      data,
      disableTrackingTool,
      txhash,
    }: TrackTransactionProps) => {
      if (!disableTrackingTool?.includes(EventTrackingTool.Hotjar)) {
        hotjar.initialized() && hotjar.event(`${category}-${action}`);
      }
      if (!disableTrackingTool?.includes(EventTrackingTool.GA)) {
        window.gtag('event', action, {
          category: category,
          ...data,
        });
      }
      if (!disableTrackingTool?.includes(EventTrackingTool.ARCx)) {
        arcx?.transaction({
          chain,
          transactionHash: txhash,
          metadata: { ...data, category, action }, // optional(object) - additional information about the transaction
        });
      }
    },
    [arcx],
  );

  return {
    trackAttribute,
    trackDisconnectWallet,
    trackEvent,
    trackPageload,
    trackTransaction,
  };
}
