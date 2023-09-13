import { useArcxAnalytics } from '@arcxmoney/analytics';
import { useCallback } from 'react';
import { hotjar } from 'react-hotjar';
import {
  TrackingActions,
  TrackingCategories,
  TrackingEventParameters,
} from '../../const';
import { useWallet } from '../../providers/WalletProvider';
import {
  EventTrackingTool,
  TrackAttributeProps,
  TrackConnectWalletProps,
  TrackEventProps,
  TrackTransactionProps,
  trackPageloadProps,
} from '../../types';

export function useUserTracking() {
  const arcx = useArcxAnalytics();
  const { account } = useWallet();

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

  const trackConnectWallet = useCallback(
    /**
     * Track Wallet-Connection with GA, HJ and ARCx
     *
     */
    async ({
      disconnect,
      data,
      disableTrackingTool,
      account,
    }: TrackConnectWalletProps) => {
      if (
        !!account.address &&
        !disableTrackingTool?.includes(EventTrackingTool.Hotjar)
      ) {
        !disconnect &&
          hotjar.identify(account.address, {
            [TrackingEventParameters.ChainId]: account.chainId,
            ...data,
          });
        hotjar.initialized() &&
          hotjar.event(`wallet${disconnect ? '-disconnect' : '-connect'}`);
      }
      if (
        !!account.address &&
        !disableTrackingTool?.includes(EventTrackingTool.Raleon)
      ) {
        !disconnect
          ? window.raleon.walletConnected(account.address)
          : window.raleon.walletDisconnected();
      }
      if (
        !!account.address &&
        !disableTrackingTool?.includes(EventTrackingTool.GA)
      ) {
        window.gtag('event', TrackingActions.ConnectWallet, {
          category: TrackingCategories.Wallet,
          label: disconnect ? 'disconnect' : 'connect',
          ...data,
        });
      }
      if (
        !disableTrackingTool?.includes(EventTrackingTool.ARCx) &&
        !disconnect
      ) {
        !!account.address &&
          (await arcx?.connectWallet({
            account: `${account.address}`,
            chain: `${account.chainId}`,
          }));
      }
    },
    [arcx],
  );

  const trackEvent = useCallback(
    /**
     * Track an Event with GA, HJ and ARCx
     *
     */
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
          label,
          ...data,
        });
      }
      if (!disableTrackingTool?.includes(EventTrackingTool.ARCx)) {
        arcx?.event(action, {
          category,
          label,
          ...data,
        });
      }
      if (
        !disableTrackingTool?.includes(EventTrackingTool.Raleon) &&
        account.isActive &&
        account.address
      ) {
        window.raleon.registerEvent(action, account.address, category);
      }
    },
    [account.address, account.isActive, arcx],
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
        window.gtag('event', TrackingActions.PageLoad, {
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
      if (
        !disableTrackingTool?.includes(EventTrackingTool.Raleon) &&
        account.isActive &&
        !!account.address
      ) {
        window.raleon.registerEvent(
          `pageload-${pageload ? 'external' : 'internal'}`,
          account.address,
          destination,
        );
      }
    },
    [account.address, account.isActive, arcx],
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
      if (
        !disableTrackingTool?.includes(EventTrackingTool.Raleon) &&
        account.isActive &&
        !!account.address
      ) {
        window.raleon.registerEvent(action, account.address, category);
      }
    },
    [account.address, account.isActive, arcx],
  );

  return {
    trackAttribute,
    trackConnectWallet,
    trackEvent,
    trackPageload,
    trackTransaction,
  };
}
