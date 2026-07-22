import type {
  ChainTokenSelected,
  NavigationTabKey,
} from '@jumperexchange/widget';
import type { MutableRefObject } from 'react';
import type { TrackTransactionDataProps } from '@/types/userTracking';

export interface WidgetTrackingUrlParams {
  sourceChainToken: { chainId: number | undefined; token: string | undefined };
  destinationChainToken: {
    chainId: number | undefined;
    token: string | undefined;
  };
  fromAmount?: string;
}

export interface WidgetTrackingSession {
  readonly sourceChainToken: ChainTokenSelected | null;
  readonly destinationChainToken: ChainTokenSelected | null;
  readonly activeTab: NavigationTabKey | null;

  onSourceTokenSelected(sourceToken: ChainTokenSelected): void;
  onTabChanged(tab: NavigationTabKey): void;
  onDestinationTokenSelected(destinationToken: ChainTokenSelected): void;
  setDestinationTokenForTracking(destinationToken: ChainTokenSelected): void;

  resolveFromToken(): string | undefined;
  resolveFromChainId(): number | undefined;
  resolveToToken(): string | undefined;
  resolveToChainId(): number | undefined;
  resolveFromAmount(fallbackFromRoute?: string): string | undefined;

  shouldSkipAvailableRoutes(fromAmount: string | undefined): boolean;
  onFromAmountChanged(fromAmount: string | undefined): void;
  markAvailableRoutesTracked(): void;

  getTrackedRoute(routeId: string): TrackTransactionDataProps | undefined;
  setTrackedRoute(routeId: string, data: TrackTransactionDataProps): void;
  clearTrackedRoute(routeId: string): void;
}

export const createWidgetTrackingSession = (
  urlParamsRef: MutableRefObject<WidgetTrackingUrlParams>,
): WidgetTrackingSession => {
  let sourceChainToken: ChainTokenSelected | null = null;
  let destinationChainToken: ChainTokenSelected | null = null;
  let activeTab: NavigationTabKey | null = null;
  let isRoutesForCurrentSourceTokenTracked = false;
  let isRoutesForCurrentDestinationTokenTracked = false;
  let isRoutesForCurrentFromAmountTracked = false;
  let currentFromAmount: string | null = null;
  const trackedRoutesData: Record<string, TrackTransactionDataProps> = {};

  const resetDestinationTracking = () => {
    isRoutesForCurrentDestinationTokenTracked = false;
  };

  return {
    get sourceChainToken() {
      return sourceChainToken;
    },
    get destinationChainToken() {
      return destinationChainToken;
    },

    get activeTab() {
      return activeTab;
    },

    onTabChanged(tab: NavigationTabKey) {
      activeTab = tab;
    },

    onSourceTokenSelected(sourceToken: ChainTokenSelected) {
      if (
        sourceChainToken?.tokenAddress !== sourceToken.tokenAddress &&
        sourceChainToken?.chainId !== sourceToken.chainId
      ) {
        isRoutesForCurrentSourceTokenTracked = false;
        sourceChainToken = sourceToken;
      }
    },

    onDestinationTokenSelected(destinationToken: ChainTokenSelected) {
      destinationChainToken = destinationToken;
      resetDestinationTracking();
    },

    setDestinationTokenForTracking(destinationToken: ChainTokenSelected) {
      destinationChainToken = destinationToken;
      resetDestinationTracking();
    },

    resolveFromToken() {
      return (
        sourceChainToken?.tokenAddress ??
        urlParamsRef.current.sourceChainToken.token
      );
    },

    resolveFromChainId() {
      return (
        sourceChainToken?.chainId ??
        urlParamsRef.current.sourceChainToken.chainId
      );
    },

    resolveToToken() {
      return (
        destinationChainToken?.tokenAddress ??
        urlParamsRef.current.destinationChainToken.token
      );
    },

    resolveToChainId() {
      return (
        destinationChainToken?.chainId ??
        urlParamsRef.current.destinationChainToken.chainId
      );
    },

    resolveFromAmount(fallbackFromRoute?: string) {
      return fallbackFromRoute ?? urlParamsRef.current.fromAmount;
    },

    shouldSkipAvailableRoutes(fromAmount: string | undefined) {
      return (
        isRoutesForCurrentSourceTokenTracked &&
        isRoutesForCurrentDestinationTokenTracked &&
        isRoutesForCurrentFromAmountTracked
      );
    },

    onFromAmountChanged(fromAmount: string | undefined) {
      if (currentFromAmount !== fromAmount) {
        currentFromAmount = fromAmount ?? null;
        isRoutesForCurrentFromAmountTracked = false;
      }
    },

    markAvailableRoutesTracked() {
      isRoutesForCurrentSourceTokenTracked = true;
      isRoutesForCurrentDestinationTokenTracked = true;
      isRoutesForCurrentFromAmountTracked = true;
    },

    getTrackedRoute(routeId: string) {
      return trackedRoutesData[routeId];
    },

    setTrackedRoute(routeId: string, data: TrackTransactionDataProps) {
      trackedRoutesData[routeId] = data;
    },

    clearTrackedRoute(routeId: string) {
      delete trackedRoutesData[routeId];
    },
  };
};
