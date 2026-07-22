import type { Route } from '@jumperexchange/widget';
import { formatTokenPrice } from '@jumperexchange/widget';
import type { ChainId } from '@lifi/sdk';
import type { Address } from 'viem';
import { TrackingEventParameter } from '@/const/trackingKeys';
import type { WidgetEventsConfig } from '@/components/Widgets/WidgetEventsManager';
import { trackWidgetEvent } from '@/components/Widgets/tracking/trackWidgetEvent';
import type {
  HandlerContext,
  WidgetEventConfig,
} from '@/components/Widgets/tracking/types';
import type { TransformedRoute } from '@/types/internal';
import { handleRouteData } from '@/utils/routes';

export const createAvailableRoutesHandler = (
  config: WidgetEventConfig,
  ctx: HandlerContext,
): WidgetEventsConfig => ({
  availableRoutes: async (routes: Route[]) => {
    const firstRoute = routes[0];
    const fromToken = ctx.session.resolveFromToken();
    const fromChainId = ctx.session.resolveFromChainId();
    const toToken = ctx.session.resolveToToken();
    const toChainId = ctx.session.resolveToChainId();
    const fromAmount = ctx.session.resolveFromAmount(firstRoute?.fromAmount);

    const fallbackToken =
      fromChainId && fromToken
        ? ctx.getToken(fromChainId as ChainId, fromToken as Address)
        : undefined;

    const fromAmountUSD = firstRoute
      ? Number(firstRoute.fromAmountUSD)
      : fallbackToken?.priceUSD && fromAmount
        ? Number(formatTokenPrice(fromAmount, fallbackToken.priceUSD))
        : 0;

    ctx.session.onFromAmountChanged(fromAmount);

    if (ctx.session.shouldSkipAvailableRoutes(fromAmount)) {
      return;
    }

    const transformedRoutes: Record<number, TransformedRoute> = routes.reduce(
      (acc, route, index) => {
        const routeData = handleRouteData(route);
        const transformedRoute: TransformedRoute = {
          [TrackingEventParameter.NbOfSteps]:
            routeData[TrackingEventParameter.NbOfSteps] || 0,
          [TrackingEventParameter.Steps]: {
            tools: routeData[TrackingEventParameter.Steps],
          },
          [TrackingEventParameter.ToAmount]:
            routeData[TrackingEventParameter.ToAmount] || '',
          [TrackingEventParameter.ToAmountUSD]:
            Number(routeData[TrackingEventParameter.ToAmountUSD]) || 0,
          [TrackingEventParameter.GasCostUSD]:
            Number(routeData[TrackingEventParameter.GasCostUSD]) || null,
          [TrackingEventParameter.Time]:
            routeData[TrackingEventParameter.Time] || 0,
          [TrackingEventParameter.Slippage]:
            routeData[TrackingEventParameter.Slippage] || 0,
        };
        return { ...acc, [index]: transformedRoute };
      },
      {},
    );

    const tradeType = ctx.session.activeTab;

    trackWidgetEvent(ctx.tracking, config, 'routes_available', {
      ...(tradeType !== null && {
        [TrackingEventParameter.TradeType]: tradeType,
      }),
      [TrackingEventParameter.FromToken]: fromToken || '',
      [TrackingEventParameter.FromChainId]: fromChainId || '',
      [TrackingEventParameter.ToToken]: toToken || '',
      [TrackingEventParameter.ToChainId]: toChainId || '',
      [TrackingEventParameter.FromAmountUSD]: fromAmountUSD,
      [TrackingEventParameter.FromAmount]: fromAmount || '',
      [TrackingEventParameter.NbOfSteps]: routes.length,
      [TrackingEventParameter.Routes]: transformedRoutes,
    });

    ctx.session.markAvailableRoutesTracked();
  },
});
