import { useArcxAnalytics } from '@arcxmoney/analytics';
import { useCallback } from 'react';
import ReactGA from 'react-ga4';
import { hotjar } from 'react-hotjar';
import { TrackingCategories } from '../../const';
import { useWallet } from '../../providers/WalletProvider';
import {
  EventTrackingTool,
  TrackAttributeProps,
  TrackConnectWalletProps,
  TrackEventProps,
  trackPageloadProps,
  TrackTransactionProps,
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
        data && ReactGA.set({ ...data });
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
        !disconnect &&
          ReactGA.set({
            username: `${account.address}`,
            chainId: `${account.chainId}`,
          });
        ReactGA.gtag('event', TrackingCategories.Wallet, {
          walletAction: disconnect ? 'disconnect' : 'connect',
          chainId: `${account.chainId}`,
          account: `${account.address}`,
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
        ReactGA.gtag('event', category, {
          action,
          label,
          ...data,
        });
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
      pageload, // requires page load?
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
        ReactGA.gtag('event', `pageload`, {
          pageLoad: pageload ? 'external' : 'internal',
          source,
          destination,
          url,
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
      transactionHash,
    }: TrackTransactionProps) => {
      if (!disableTrackingTool?.includes(EventTrackingTool.Hotjar)) {
        hotjar.initialized() && hotjar.event(`${category}-${action}`);
      }
      if (!disableTrackingTool?.includes(EventTrackingTool.GA)) {
        ReactGA.gtag('event', 'transaction', {
          category,
          action,
          ...data,
          transactionHash,
        });
      }
      if (!disableTrackingTool?.includes(EventTrackingTool.ARCx)) {
        await arcx?.transaction({
          chain, // required(string) - chain ID that the transaction is taking place on
          transactionHash, // required(string) - hash of the transaction
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
