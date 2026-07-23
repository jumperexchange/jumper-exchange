'use client';
import type { RouteExtended } from '@lifi/sdk';
import { useAccount } from '@lifi/wallet-management';
import type { RouteSelected } from '@lifi/widget';
import { useWidgetEvents } from '@lifi/widget';
import { useEffect, useRef } from 'react';
import { useActiveTabStore } from 'src/stores/activeTab';
import { AB_TEST_NAME } from '@/const/abtests';
import { TabsMap } from '@/const/tabsMap';
import { useABTest } from '@/hooks/useABTest';
import { useSocialCardStore } from '@/stores/socialCard/SocialCardStore';
import {
  debugExtraOutputCard,
  deriveExtraOutputCard,
  deriveExtraOutputCardPreview,
  type QuoteSelection,
} from '@/utils/image-generation/deriveExtraOutputCard';
import { isBeta } from '@/utils/isBeta';
import { isProduction } from '@/utils/isProduction';
import { getRouteStatus } from '@/utils/routes';
import type { WidgetEventsConfig } from '../../WidgetEventsManager';
import {
  setupWidgetEvents,
  teardownWidgetEvents,
} from '../../WidgetEventsManager';

/**
 * Log a quote-by-quote breakdown of how the "extra output" card is derived for
 * a completed route. Dev-only aid for validating the median comparison.
 */
function logExtraOutputDebug(selection: QuoteSelection) {
  const debug = debugExtraOutputCard(selection);
  /* eslint-disable no-console */
  console.groupCollapsed(
    `[SocialCard] ${debug.fromToken} → ${debug.toToken} · selected $${debug.selectedValueUSD} · median $${debug.medianUSD} · amountWon $${debug.amountWon} (baseline: ${debug.baselineSource}, ${debug.eligibleCount}/${debug.totalQuotes} eligible)`,
  );
  console.log('summary', debug);
  console.table(debug.quotes);
  console.groupEnd();
  /* eslint-enable no-console */
}

/**
 * Listens to the LI.FI widget and, for a successful conversion that beat the
 * median eligible quote on the same route, opens the "extra output" social
 * card nudge (JUMADV-1).
 *
 * The competing quotes are only available at selection time (`routeSelected`),
 * so they are captured there and matched back to the executed route on
 * `routeExecutionCompleted`.
 */
export const useSocialCardEvent = () => {
  const widgetEvents = useWidgetEvents();
  const { account } = useAccount();
  const showCard = useSocialCardStore((state) => state.showCard);
  const setLatestSelection = useSocialCardStore(
    (state) => state.setLatestSelection,
  );
  const selectionsRef = useRef<Map<string, QuoteSelection>>(new Map());

  // Strapi-controlled feature flag with percentage rollout (JUM-844): only a
  // sampled slice of sessions ever surfaces the card.
  const { isEnabled } = useABTest({ feature: AB_TEST_NAME.SOCIAL_CARD });
  const isEnabledRef = useRef(isEnabled);
  isEnabledRef.current = isEnabled;

  // The card only makes sense on the swap/bridge (Exchange) tab — not gas,
  // buy or private.
  const activeTab = useActiveTabStore((state) => state.activeTab);
  const isExchangeTabRef = useRef(activeTab === TabsMap.Exchange.index);
  isExchangeTabRef.current = activeTab === TabsMap.Exchange.index;

  useEffect(() => {
    const selections = selectionsRef.current;

    const routeSelected = (data: RouteSelected) => {
      if (data?.route?.id) {
        const selection = { route: data.route, routes: data.routes };
        selections.set(data.route.id, selection);
        // Keep the newest selection around so the beta test trigger can preview
        // the card with real quote data.
        setLatestSelection(selection);
      }
    };

    const routeExecutionCompleted = async (route: RouteExtended) => {
      if (!route.id || getRouteStatus(route) !== 'DONE') {
        return;
      }

      const selection = selections.get(route.id);
      selections.delete(route.id);
      if (!selection) {
        return;
      }

      if (!isProduction) {
        logExtraOutputDebug(selection);
      }

      if (!isExchangeTabRef.current) {
        return;
      }

      // Beta sessions (use-beta localStorage flag) bypass the rollout flag and
      // the $10 minimum so the nudge can be validated on any real transaction.
      // Everyone else needs the Strapi flag and the >$10 threshold.
      const beta = isBeta();
      const card = beta
        ? deriveExtraOutputCardPreview(selection)
        : isEnabledRef.current
          ? deriveExtraOutputCard(selection)
          : null;
      if (!card) {
        return;
      }

      showCard({
        ...card,
        referralCode: account?.address,
      });
    };

    const config: WidgetEventsConfig = {
      routeSelected,
      routeExecutionCompleted,
    };
    setupWidgetEvents(config, widgetEvents);
    return () => teardownWidgetEvents(config, widgetEvents);
  }, [widgetEvents, account?.address, showCard, setLatestSelection]);
};
