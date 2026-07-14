'use client';
import { useAccount } from '@jumperexchange/wallet-management';
import type { FormState } from '@jumperexchange/widget';
import { PrefetchKind } from 'next/dist/client/components/router-reducer/router-reducer-types';
import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useBridgeConditions } from 'src/hooks/useBridgeConditions';
import { useMultisig } from 'src/hooks/useMultisig';
import { useWelcomeScreen } from 'src/hooks/useWelcomeScreen';
import { useActiveTabStore } from 'src/stores/activeTab';
import { useContributionStore } from 'src/stores/contribution/ContributionStore';
import envConfig from '@/config/env-config';
import { AB_TEST_NAME } from '@/const/abtests';
import { AppPaths } from '@/const/urls';
import { useABTest } from '@/hooks/useABTest';
import { useThemeStore } from '@/stores/theme';
import { useFormParameters } from './hooks';
import { Widget as BaseWidget } from './variants/base/Widget';
import type {
  MainWidgetContext,
  WidgetVariantDescriptor,
} from './variants/widgetConfig/types';
import { resolveWidgetVariant } from './variants/widgetConfig/utils';
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
  const [configTheme] = useThemeStore((state) => [state.configTheme]);
  const formRef = useRef<FormState>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const bridgeConditions = useBridgeConditions({
    formRef,
    allowToChains,
    configThemeChains: configTheme?.chains,
  });
  const [isPrivateSwapModalOpen, setIsPrivateSwapModalOpen] = useState(false);

  useEffect(() => {
    setIsPrivateSwapModalOpen(bridgeConditions.isPrivateSwapSelected);
  }, [bridgeConditions.isPrivateSwapSelected]);

  const router = useRouter();
  const pathname = usePathname();
  const { account } = useAccount();
  const isConnectedAGW = account?.connector?.name === 'Abstract';
  const { isSafe } = useMultisig();

  const { activeTab } = useActiveTabStore();
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

  const resolvedVariant = useMemo(
    () =>
      resolveWidgetVariant(starterVariant, {
        limitOrders: limitOrdersFeatureFlag.isEnabled,
        privateSwaps: privateSwapsFeatureFlag.isEnabled,
      }),
    [
      starterVariant,
      limitOrdersFeatureFlag.isEnabled,
      privateSwapsFeatureFlag.isEnabled,
    ],
  );

  const effectiveVariant: WidgetVariantDescriptor = useMemo(
    () =>
      disableTabNavigation
        ? { ...resolvedVariant, navigationTabs: undefined }
        : resolvedVariant,
    [disableTabNavigation, resolvedVariant],
  );

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
  }, [configTheme.integrator, widgetIntegrator, starterVariant]) as string;

  const formParametersCtx = useFormParameters({
    fromChain,
    fromToken,
    toChain,
    toToken,
    fromAmount,
  });

  const context: MainWidgetContext = useMemo(
    () => ({
      integrator: integratorStringByType,
      starterVariant,
      resolvedVariant: effectiveVariant,
      partnerName,
      formData: formParametersCtx,
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
      formParametersCtx,
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
