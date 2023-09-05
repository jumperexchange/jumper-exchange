import { useArcxAnalytics } from '@arcxmoney/analytics';
import { useCallback } from 'react';
import ReactGA from 'react-ga4';
import { hotjar } from 'react-hotjar';
import {
  TrackingActions,
  TrackingCategories,
  TrackingEventParameters,
  TrackingUserProperties,
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
      if (data && !disableTrackingTool?.includes(EventTrackingTool.Hotjar)) {
        hotjar.initialized() &&
          hotjar.identify(account.address ? account.address : null, {
            ...data,
          });
      }
      if (data && !disableTrackingTool?.includes(EventTrackingTool.GA)) {
        data && ReactGA.gtag('set', 'user_properties', data);
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
          hotjar.identify(`${account.address}`, {
            chainId: `${account.chainId}`,
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
        disconnect
          ? ReactGA.gtag('set', 'user_properties', {
              [TrackingUserProperties.Connected]: 'false',
            })
          : ReactGA.gtag('set', 'user_properties', {
              [TrackingUserProperties.UserAddress]: account.address,
              [TrackingUserProperties.ChainId]: account.chainId,
              [TrackingUserProperties.Connected]: 'true',
              [TrackingUserProperties.HadConnected]: 'true',
            });

        ReactGA.gtag('event', TrackingActions.ConnectWallet, {
          category: TrackingCategories.Wallet,
          label: disconnect ? 'disconnect' : 'connect',
          [TrackingEventParameters.ChainId]: `${account.chainId}`,
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
          hotjar.event(`${category}-${action}${label ?? '-' + label}`);
      }
      if (!disableTrackingTool?.includes(EventTrackingTool.GA)) {
        console.log('GA-output', {
          category: category,
          action: action,
          label, // optional
          ...data,
        });

        ReactGA.event(action, {
          category: category,
          label,
          ...data,
          // value: 99, // optional, must be a number
          // nonInteraction: true, // optional, true/false
          // transport: "xhr", // optional, beacon/xhr/image
        });
        /* 
        Alternative usage:
        ReactGA.gtag('event', action, {
          category: category,
          label,
          ...data,
          });
        */
      }
      if (!disableTrackingTool?.includes(EventTrackingTool.ARCx)) {
        arcx?.event(`${category}-${action}`, {
          category,
          label,
          action,
          ...data,
        });
      }
      if (
        !disableTrackingTool?.includes(EventTrackingTool.Raleon) &&
        account.isActive &&
        !!account.address
      ) {
        window.raleon.registerEvent(
          `${category}`,
          account.address,
          `${action}-${label}`,
        );
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
          : hotjar.event(
              `pageload${source && '-' + source}${
                pageload ? '-external' : '-internal'
              }${destination && '-' + destination}`,
            );
      }
      if (!disableTrackingTool?.includes(EventTrackingTool.GA)) {
        ReactGA.gtag('event', TrackingActions.PageLoad, {
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
        ReactGA.gtag('event', action, {
          category: category,
          chain,
          txhash,
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
    trackConnectWallet,
    trackEvent,
    trackPageload,
    trackTransaction,
  };
}
