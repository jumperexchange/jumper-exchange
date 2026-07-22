'use client';
import { useAccount } from '@jumperexchange/wallet-management';
import type { FormState } from '@jumperexchange/widget';
import { PrefetchKind } from 'next/dist/client/components/router-reducer/router-reducer-types';
import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useBridgeConditions } from 'src/hooks/useBridgeConditions';
import { useMultisig } from 'src/hooks/useMultisig';
import { useWelcomeScreen } from 'src/hooks/useWelcomeScreen';
import { useContributionStore } from 'src/stores/contribution/ContributionStore';
import envConfig from '@/config/env-config';
import { AB_TEST_NAME } from '@/const/abtests';
import { AppPaths } from '@/const/urls';
import { useABTest } from '@/hooks/useABTest';
import { useActiveNavigationTab } from '@/hooks/useActiveNavigationTab';
import { useThemeStore } from '@/stores/theme';
import { useFormParameters } from './hooks';
import { Widget as BaseWidget } from './variants/base/Widget';
import type {
  MainWidgetContext,
  WidgetVariantDescriptor,
} from './variants/widgetConfig/types';
import {
  applyWidgetChainTokenFields,
  clearWidgetChainTokenCache,
  consumeWidgetSurfaceNavigation,
  getUrlChainTokenParams,
  resolveActiveNavigationTab,
  resolveWidgetPlaceholderTokens,
  resolveWidgetVariant,
  writeUrlChainTokenParams,
} from './variants/widgetConfig/utils';
import { WidgetWrapper } from './Widget.style';
import type { WidgetProps } from './Widget.types';

const PrivateSwapModal = dynamic(() =>
  import('./PrivateSwapModal/PrivateSwapModal').then(
    (mod) => mod.PrivateSwapModal,
  ),
);

export function Widget({
  starterVariant,
  fromChain,
  fromToken,
  toChain,
  toToken,
  fromAmount,
  allowChains: allowFromChains,
  allowToChains,
  widgetIntegrator,
  activeTheme,
  autoHeight,
  isLoading,
  disableTabNavigation = false,
}: WidgetProps) {
  // Destination Simple↔Advanced: clear URL + cache before URL snapshot / form seed.
  useState(() => {
    consumeWidgetSurfaceNavigation();
    return null;
  });

  const [configTheme] = useThemeStore((state) => [state.configTheme]);
  const formRef = useRef<FormState>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const bridgeConditions = useBridgeConditions({
    formRef,
    allowToChains,
    configThemeChains: configTheme?.chains,
  });
  const [isPrivateSwapModalOpen, setIsPrivateSwapModalOpen] = useState(false);
  // After the user changes tabs, stop feeding chain/token via widget config so
  // FormUpdater does not overwrite setFieldValue placeholders (or clears).
  const [seedChainTokensFromConfig, setSeedChainTokensFromConfig] =
    useState(true);

  useEffect(() => {
    setIsPrivateSwapModalOpen(bridgeConditions.isPrivateSwapSelected);
  }, [bridgeConditions.isPrivateSwapSelected]);

  const router = useRouter();
  const pathname = usePathname();
  const { account } = useAccount();
  const isConnectedAGW = account?.connector?.name === 'Abstract';
  const { isSafe } = useMultisig();

  const partnerName = configTheme?.uid ?? 'default';
  const contributionDisplayed = useContributionStore(
    (state) => state.contributionDisplayed,
  );

  const privateSwapsFeatureFlag = useABTest({
    feature: AB_TEST_NAME.PRIVATE_SWAPS,
    address: account?.address ?? '',
  });

  const limitOrdersFeatureFlag = useABTest({
    feature: AB_TEST_NAME.LIMIT_ORDERS,
    address: account?.address ?? '',
  });

  const widgetAdvancedFeatureFlag = useABTest({
    feature: AB_TEST_NAME.WIDGET_ADVANCED,
  });

  const resolvedVariant = useMemo(
    () =>
      resolveWidgetVariant(starterVariant, {
        limitOrders:
          limitOrdersFeatureFlag.isLoading || limitOrdersFeatureFlag.isEnabled,
        privateSwaps:
          privateSwapsFeatureFlag.isLoading ||
          privateSwapsFeatureFlag.isEnabled,
        widgetAdvanced:
          widgetAdvancedFeatureFlag.isLoading ||
          widgetAdvancedFeatureFlag.isEnabled,
      }),
    [
      starterVariant,
      limitOrdersFeatureFlag.isEnabled,
      limitOrdersFeatureFlag.isLoading,
      privateSwapsFeatureFlag.isEnabled,
      privateSwapsFeatureFlag.isLoading,
      widgetAdvancedFeatureFlag.isEnabled,
      widgetAdvancedFeatureFlag.isLoading,
    ],
  );

  const effectiveVariant: WidgetVariantDescriptor = useMemo(
    () =>
      disableTabNavigation
        ? { ...resolvedVariant, navigationTabs: undefined }
        : resolvedVariant,
    [disableTabNavigation, resolvedVariant],
  );

  const globalActiveNavigationTab = useActiveNavigationTab();
  const activeTabKey = resolveActiveNavigationTab({
    type: 'main',
    resolvedVariant: effectiveVariant,
    globalActiveNavigationTab,
  });

  // Keep the widget mounted. On tab change, write placeholders (or clear) into
  // the existing FormStore so navigation state is preserved.
  const previousActiveTabKeyRef = useRef(activeTabKey);
  const pendingTabApplyRef = useRef<typeof activeTabKey>(null);
  const needsRemountReseedRef = useRef(false);

  useLayoutEffect(() => {
    const previous = previousActiveTabKeyRef.current;
    previousActiveTabKeyRef.current = activeTabKey;
    if (!previous || !activeTabKey || previous === activeTabKey) {
      return;
    }

    clearWidgetChainTokenCache();

    // Tab flipped while LiFiWidget is gated (null formRef): do not latch off —
    // otherwise a later remount seeds an empty form. Apply when form is ready.
    if (!formRef.current) {
      pendingTabApplyRef.current = activeTabKey;
      return;
    }

    setSeedChainTokensFromConfig(false);
    needsRemountReseedRef.current = true;
    applyWidgetChainTokenFields(
      formRef.current,
      resolveWidgetPlaceholderTokens(starterVariant, activeTabKey) ?? null,
    );
  }, [activeTabKey, starterVariant]);

  const handleFormReady = () => {
    const pendingTab = pendingTabApplyRef.current;
    const shouldReseed = pendingTab != null || needsRemountReseedRef.current;

    if (shouldReseed && formRef.current) {
      pendingTabApplyRef.current = null;
      needsRemountReseedRef.current = false;
      setSeedChainTokensFromConfig(false);

      const tabKey = pendingTab ?? activeTabKey;
      const placeholders = resolveWidgetPlaceholderTokens(
        starterVariant,
        tabKey,
      );
      const liveUrl = getUrlChainTokenParams();
      const tokens = placeholders
        ? {
            fromChain: liveUrl.fromChain ?? placeholders.fromChain,
            fromToken: liveUrl.fromToken ?? placeholders.fromToken,
            toChain: liveUrl.toChain ?? placeholders.toChain,
            toToken: liveUrl.toToken ?? placeholders.toToken,
          }
        : null;

      applyWidgetChainTokenFields(formRef.current, tokens);
      return;
    }

    // Cold config seed does not write the query string; mirror placeholders so
    // URL-driven panels (Market Price on Limit) match the form.
    const liveUrl = getUrlChainTokenParams();
    const hasUrlPair =
      liveUrl.fromChain != null ||
      liveUrl.fromToken != null ||
      liveUrl.toChain != null ||
      liveUrl.toToken != null;
    if (hasUrlPair) {
      return;
    }

    writeUrlChainTokenParams(
      resolveWidgetPlaceholderTokens(starterVariant, activeTabKey) ?? null,
    );
  };

  useEffect(() => {
    const routes = [AppPaths.Main, AppPaths.Advanced].filter(
      (route) => route !== pathname,
    );

    const runPrefetch = () => {
      routes.forEach((route) =>
        router.prefetch(route, { kind: PrefetchKind.AUTO }),
      );
    };

    const hasRIC =
      typeof window !== 'undefined' && 'requestIdleCallback' in window;

    const id = hasRIC
      ? window.requestIdleCallback(runPrefetch)
      : window.setTimeout(runPrefetch, 0);

    return () => {
      if (hasRIC) {
        window.cancelIdleCallback(id);
      } else {
        window.clearTimeout(id);
      }
    };
  }, [router, pathname]);

  const { welcomeScreenClosed, enabled } = useWelcomeScreen();

  const integratorStringByType = useMemo(() => {
    if (configTheme?.integrator) {
      return configTheme.integrator;
    }
    if (widgetIntegrator) {
      return widgetIntegrator;
    }
    if (starterVariant === 'advanced') {
      return envConfig.NEXT_PUBLIC_WIDGET_INTEGRATOR_ADVANCED;
    }

    return envConfig.NEXT_PUBLIC_WIDGET_INTEGRATOR;
  }, [configTheme?.integrator, widgetIntegrator, starterVariant]) as string;

  const formParametersCtx = useFormParameters({
    fromChain,
    fromToken,
    toChain,
    toToken,
    fromAmount,
    starterVariant,
    activeTabKey,
  });

  const formData = useMemo(() => {
    if (seedChainTokensFromConfig) {
      return formParametersCtx;
    }

    return fromAmount ? { fromAmount } : {};
  }, [formParametersCtx, fromAmount, seedChainTokensFromConfig]);

  const context: MainWidgetContext = useMemo(
    () => ({
      integrator: integratorStringByType,
      starterVariant,
      resolvedVariant: effectiveVariant,
      partnerName,
      formData,
      allowFromChains: allowFromChains,
      allowToChains,
      bridgeConditions,
      isConnectedAGW,
      isSafeContext: isSafe,
    }),
    [
      starterVariant,
      effectiveVariant,
      partnerName,
      formData,
      allowFromChains,
      allowToChains,
      bridgeConditions,
      isConnectedAGW,
      isSafe,
      integratorStringByType,
    ],
  );

  return (
    <WidgetWrapper
      ref={wrapperRef}
      className="widget-wrapper"
      welcomeScreenClosed={welcomeScreenClosed || !enabled}
      autoHeight={autoHeight}
      contributionDisplayed={contributionDisplayed}
    >
      <BaseWidget
        type="main"
        ctx={context}
        formRef={formRef}
        isLoading={isLoading}
        onFormReady={handleFormReady}
      />
      {isPrivateSwapModalOpen && (
        <PrivateSwapModal
          open={isPrivateSwapModalOpen}
          initialAddress={bridgeConditions.toAddress}
          onClose={() => setIsPrivateSwapModalOpen(false)}
          onConfirm={(addr) => {
            formRef.current?.setFieldValue('toAddress', addr, {
              setUrlSearchParam: true,
            });
            setIsPrivateSwapModalOpen(false);
          }}
        />
      )}
    </WidgetWrapper>
  );
}
