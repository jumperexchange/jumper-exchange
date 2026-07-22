import { describe, it, expect, vi, beforeEach } from 'vitest';
import { composeWidgetTrackingHandlers } from '@/components/Widgets/tracking/composeWidgetTrackingHandlers';
import { createWidgetTrackingSession } from '@/components/Widgets/tracking/WidgetTrackingSession';
import { createWidgetTrackerConfig } from '@/components/Widgets/tracking/widgetTrackingPresets';
import type { HandlerContext } from '@/components/Widgets/tracking/types';
import type { WidgetEventTrackerConfig } from '@/components/Widgets/tracking/types';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventDataAction,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import type { Route, RouteExecutionUpdate } from '@jumperexchange/widget';

vi.mock('src/utils/routes', () => ({
  handleRouteData: vi.fn((route: Route, extra?: Record<string, unknown>) => ({
    routeId: route.id,
    ...extra,
  })),
}));

vi.mock('src/utils/tracking/widget', () => ({
  parseWidgetSettingsToTrackingData: vi.fn(() => ({ setting: 'value' })),
  parseFormFieldChangedToTrackingData: vi.fn((data: unknown) => ({
    field: data,
  })),
}));

vi.mock('@jumperexchange/widget', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@jumperexchange/widget')>();
  return {
    ...actual,
    formatTokenPrice: vi.fn(() => '100'),
  };
});

const makeRef = <T>(value: T) => ({ current: value });

const makeContext = (
  overrides: Partial<HandlerContext> = {},
): HandlerContext => {
  const urlParamsRef = makeRef({
    sourceChainToken: { chainId: undefined, token: undefined },
    destinationChainToken: { chainId: undefined, token: undefined },
    fromAmount: undefined,
  });

  return {
    tracking: {
      trackEvent: vi.fn(),
      trackTransaction: vi.fn(),
    },
    session: createWidgetTrackingSession(urlParamsRef),
    getToken: vi.fn(),
    ...overrides,
  };
};

const makeRoute = (overrides: Partial<Route> = {}): Route =>
  ({
    id: 'route-1',
    fromAmount: '1000000000000000000',
    fromAmountUSD: '1000',
    steps: [],
    ...overrides,
  }) as unknown as Route;

describe('composeWidgetTrackingHandlers', () => {
  describe('empty config', () => {
    it('returns no handlers when config is empty', () => {
      const handlers = composeWidgetTrackingHandlers({}, makeContext());
      expect(Object.keys(handlers)).toHaveLength(0);
    });
  });

  describe('sourceChainTokenSelected', () => {
    it('is not defined when sourceChainAndTokenSelection is absent', () => {
      const handlers = composeWidgetTrackingHandlers({}, makeContext());
      expect(handlers.sourceChainTokenSelected).toBeUndefined();
    });

    it('calls trackEvent with correct action and label', async () => {
      const ctx = makeContext();
      const handlers = composeWidgetTrackingHandlers(
        {
          sourceChainAndTokenSelection: {
            action: TrackingAction.OnSourceChainAndTokenSelection,
          },
        },
        ctx,
      );
      await handlers.sourceChainTokenSelected!({
        chainId: 1,
        tokenAddress: '0xabc',
      });
      expect(ctx.tracking.trackEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: TrackingAction.OnSourceChainAndTokenSelection,
          label: 'select_source_chain_and_token',
          category: TrackingCategory.WidgetEvent,
        }),
      );
    });

    it('uses a custom label when provided', async () => {
      const ctx = makeContext();
      const handlers = composeWidgetTrackingHandlers(
        {
          sourceChainAndTokenSelection: {
            action: TrackingAction.OnSourceChainAndTokenSelection,
            label: 'custom',
          },
        },
        ctx,
      );
      await handlers.sourceChainTokenSelected!({
        chainId: 1,
        tokenAddress: '0xabc',
      });
      expect(ctx.tracking.trackEvent).toHaveBeenCalledWith(
        expect.objectContaining({ label: 'custom' }),
      );
    });

    it('resets the source-token tracked flag when selection changes', async () => {
      const ctx = makeContext();
      ctx.session.onSourceTokenSelected({
        chainId: 2 as never,
        tokenAddress: '0xold',
      });
      ctx.session.markAvailableRoutesTracked();

      const handlers = composeWidgetTrackingHandlers(
        {
          sourceChainAndTokenSelection: {
            action: TrackingAction.OnSourceChainAndTokenSelection,
          },
          availableRoutes: { action: TrackingAction.OnAvailableRoutes },
        },
        ctx,
      );
      await handlers.sourceChainTokenSelected!({
        chainId: 1,
        tokenAddress: '0xnew',
      });
      await handlers.availableRoutes!([makeRoute()]);
      expect(ctx.tracking.trackEvent).toHaveBeenCalledTimes(2);
    });
  });

  describe('destinationChainTokenSelected', () => {
    it('is not defined when destinationChainAndTokenSelection is absent', () => {
      const handlers = composeWidgetTrackingHandlers({}, makeContext());
      expect(handlers.destinationChainTokenSelected).toBeUndefined();
    });

    it('calls trackEvent and updates destination ref', async () => {
      const ctx = makeContext();
      const handlers = composeWidgetTrackingHandlers(
        {
          destinationChainAndTokenSelection: {
            action: TrackingAction.OnDestinationChainAndTokenSelection,
          },
        },
        ctx,
      );
      await handlers.destinationChainTokenSelected!({
        chainId: 10,
        tokenAddress: '0xdef',
      });
      expect(ctx.tracking.trackEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: TrackingAction.OnDestinationChainAndTokenSelection,
        }),
      );
      expect(ctx.session.destinationChainToken).toEqual({
        chainId: 10,
        tokenAddress: '0xdef',
      });
    });
  });

  describe('availableRoutes', () => {
    it('is not defined when availableRoutes config is absent', () => {
      const handlers = composeWidgetTrackingHandlers({}, makeContext());
      expect(handlers.availableRoutes).toBeUndefined();
    });

    it('calls trackEvent with correct action', async () => {
      const ctx = makeContext();
      const handlers = composeWidgetTrackingHandlers(
        { availableRoutes: { action: TrackingAction.OnAvailableRoutes } },
        ctx,
      );
      await handlers.availableRoutes!([makeRoute()]);
      expect(ctx.tracking.trackEvent).toHaveBeenCalledWith(
        expect.objectContaining({ action: TrackingAction.OnAvailableRoutes }),
      );
    });

    it('does not fire again when all dedup flags are true', async () => {
      const ctx = makeContext();
      const handlers = composeWidgetTrackingHandlers(
        { availableRoutes: { action: TrackingAction.OnAvailableRoutes } },
        ctx,
      );
      await handlers.availableRoutes!([makeRoute()]);
      await handlers.availableRoutes!([makeRoute()]);
      expect(ctx.tracking.trackEvent).toHaveBeenCalledTimes(1);
    });

    it('merges extraData into the event data', async () => {
      const ctx = makeContext();
      const handlers = composeWidgetTrackingHandlers(
        {
          availableRoutes: {
            action: TrackingAction.OnAvailableRoutes,
            extraData: { custom: 'val' },
          },
        },
        ctx,
      );
      await handlers.availableRoutes!([makeRoute()]);
      expect(ctx.tracking.trackEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ custom: 'val' }),
        }),
      );
    });

    it('falls back to urlParams for fromToken and fromChainId when no token is selected', async () => {
      const urlParamsRef = makeRef({
        sourceChainToken: { chainId: 137, token: '0xurl_from_token' },
        destinationChainToken: { chainId: 10, token: '0xurl_to_token' },
        fromAmount: undefined,
      });
      const ctx = makeContext({
        session: createWidgetTrackingSession(urlParamsRef),
      });
      const handlers = composeWidgetTrackingHandlers(
        { availableRoutes: { action: TrackingAction.OnAvailableRoutes } },
        ctx,
      );

      await handlers.availableRoutes!([makeRoute()]);

      expect(ctx.tracking.trackEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            [TrackingEventParameter.FromToken]: '0xurl_from_token',
            [TrackingEventParameter.FromChainId]: 137,
            [TrackingEventParameter.ToToken]: '0xurl_to_token',
            [TrackingEventParameter.ToChainId]: 10,
          }),
        }),
      );
    });

    it('falls back to urlParams fromAmount when route has no fromAmount', async () => {
      const urlParamsRef = makeRef({
        sourceChainToken: { chainId: undefined, token: undefined },
        destinationChainToken: { chainId: undefined, token: undefined },
        fromAmount: '5000000000000000000',
      });
      const ctx = makeContext({
        session: createWidgetTrackingSession(urlParamsRef),
      });
      const handlers = composeWidgetTrackingHandlers(
        { availableRoutes: { action: TrackingAction.OnAvailableRoutes } },
        ctx,
      );

      await handlers.availableRoutes!([makeRoute({ fromAmount: undefined })]);

      expect(ctx.tracking.trackEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            [TrackingEventParameter.FromAmount]: '5000000000000000000',
          }),
        }),
      );
    });
  });

  describe('routeExecutionStarted', () => {
    it('is not defined when routeExecutionStarted config is absent', () => {
      const handlers = composeWidgetTrackingHandlers({}, makeContext());
      expect(handlers.routeExecutionStarted).toBeUndefined();
    });

    it('calls trackTransaction with correct action', async () => {
      const ctx = makeContext();
      const handlers = composeWidgetTrackingHandlers(
        {
          routeExecutionStarted: {
            action: TrackingAction.OnRouteExecutionStarted,
            dataAction: TrackingEventDataAction.ExecutionStart,
          },
        },
        ctx,
      );
      await handlers.routeExecutionStarted!(makeRoute());
      expect(ctx.tracking.trackTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          action: TrackingAction.OnRouteExecutionStarted,
          label: 'execution_start',
        }),
      );
    });

    it('stores route data in session', async () => {
      const ctx = makeContext();
      const route = makeRoute({ id: 'r-123' });
      const handlers = composeWidgetTrackingHandlers(
        {
          routeExecutionStarted: {
            action: TrackingAction.OnRouteExecutionStarted,
            dataAction: TrackingEventDataAction.ExecutionStart,
          },
        },
        ctx,
      );
      await handlers.routeExecutionStarted!(route);
      expect(ctx.session.getTrackedRoute('r-123')).toBeDefined();
    });
  });

  describe('routeExecutionCompleted', () => {
    it('calls trackTransaction and removes route from session', async () => {
      const ctx = makeContext();
      ctx.session.setTrackedRoute('r-xyz', { routeId: 'r-xyz' } as never);

      const handlers = composeWidgetTrackingHandlers(
        {
          routeExecutionCompleted: {
            action: TrackingAction.OnRouteExecutionCompleted,
            dataAction: TrackingEventDataAction.ExecutionCompleted,
          },
        },
        ctx,
      );
      await handlers.routeExecutionCompleted!(makeRoute({ id: 'r-xyz' }));
      expect(ctx.tracking.trackTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          action: TrackingAction.OnRouteExecutionCompleted,
        }),
      );
      expect(ctx.session.getTrackedRoute('r-xyz')).toBeUndefined();
    });
  });

  describe('routeExecutionFailed', () => {
    it('calls trackTransaction with correct action', async () => {
      const ctx = makeContext();
      const update: RouteExecutionUpdate = {
        route: makeRoute(),
        action: { error: undefined, message: 'out of gas' } as never,
      };
      const handlers = composeWidgetTrackingHandlers(
        {
          routeExecutionFailed: {
            action: TrackingAction.OnRouteExecutionFailed,
            dataAction: TrackingEventDataAction.ExecutionFailed,
          },
        },
        ctx,
      );
      await handlers.routeExecutionFailed!(update);
      expect(ctx.tracking.trackTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          action: TrackingAction.OnRouteExecutionFailed,
        }),
      );
    });

    it('calls trackTransaction and removes route from session', async () => {
      const ctx = makeContext();
      ctx.session.setTrackedRoute('r-fail', { routeId: 'r-fail' } as never);

      const update: RouteExecutionUpdate = {
        route: makeRoute({ id: 'r-fail' }),
        action: { error: undefined, message: 'out of gas' } as never,
      };
      const handlers = composeWidgetTrackingHandlers(
        {
          routeExecutionFailed: {
            action: TrackingAction.OnRouteExecutionFailed,
            dataAction: TrackingEventDataAction.ExecutionFailed,
          },
        },
        ctx,
      );

      await handlers.routeExecutionFailed!(update);

      expect(ctx.tracking.trackTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          action: TrackingAction.OnRouteExecutionFailed,
        }),
      );
      expect(ctx.session.getTrackedRoute('r-fail')).toBeUndefined();
    });
  });

  describe('routeExecutionUpdated', () => {
    it('is not defined when routeExecutionUpdated config is absent', () => {
      const handlers = composeWidgetTrackingHandlers({}, makeContext());
      expect(handlers.routeExecutionUpdated).toBeUndefined();
    });

    it('does not fire when route was not previously tracked', async () => {
      const ctx = makeContext();
      const handlers = composeWidgetTrackingHandlers(
        {
          routeExecutionUpdated: {
            action: TrackingAction.OnRouteExecutionUpdated,
            dataAction: TrackingEventDataAction.ExecutionUpdated,
          },
        },
        ctx,
      );
      const update: RouteExecutionUpdate = {
        route: makeRoute({ id: 'r-1' }),
        action: {} as never,
      };

      await handlers.routeExecutionUpdated!(update);

      expect(ctx.tracking.trackTransaction).not.toHaveBeenCalled();
    });

    it('does not fire when route data has not changed (isEqual guard)', async () => {
      const { handleRouteData } = await import('src/utils/routes');
      vi.mocked(handleRouteData).mockReturnValue({
        routeId: 'r-1',
        status: 'same',
      } as never);

      const ctx = makeContext();
      ctx.session.setTrackedRoute('r-1', {
        routeId: 'r-1',
        status: 'same',
      } as never);

      const handlers = composeWidgetTrackingHandlers(
        {
          routeExecutionUpdated: {
            action: TrackingAction.OnRouteExecutionUpdated,
            dataAction: TrackingEventDataAction.ExecutionUpdated,
          },
        },
        ctx,
      );
      const update: RouteExecutionUpdate = {
        route: makeRoute({ id: 'r-1' }),
        action: {} as never,
      };
      await handlers.routeExecutionUpdated!(update);
      expect(ctx.tracking.trackTransaction).not.toHaveBeenCalled();
    });
  });

  describe('changeSettings', () => {
    it('calls trackEvent with correct action', async () => {
      const ctx = makeContext();
      const handlers = composeWidgetTrackingHandlers(
        { changeSettings: { action: TrackingAction.OnChangeSettings } },
        ctx,
      );
      await handlers.settingUpdated!({} as never);
      expect(ctx.tracking.trackEvent).toHaveBeenCalledWith(
        expect.objectContaining({ action: TrackingAction.OnChangeSettings }),
      );
    });
  });

  describe('formFieldChanged', () => {
    it('ignores fields other than toAddress', async () => {
      const ctx = makeContext();
      const handlers = composeWidgetTrackingHandlers(
        { formFieldChanged: { action: TrackingAction.OnFormFieldChanged } },
        ctx,
      );
      await handlers.formFieldChanged!({
        fieldName: 'fromAmount',
        value: '1',
      } as never);
      expect(ctx.tracking.trackEvent).not.toHaveBeenCalled();
    });

    it('tracks the toAddress field', async () => {
      const ctx = makeContext();
      const handlers = composeWidgetTrackingHandlers(
        { formFieldChanged: { action: TrackingAction.OnFormFieldChanged } },
        ctx,
      );
      await handlers.formFieldChanged!({
        fieldName: 'toAddress',
        value: '0x123',
      } as never);
      expect(ctx.tracking.trackEvent).toHaveBeenCalledWith(
        expect.objectContaining({ action: TrackingAction.OnFormFieldChanged }),
      );
    });
  });

  describe('routeSelected', () => {
    it('calls trackTransaction with correct action', async () => {
      const ctx = makeContext();
      const route = makeRoute();
      const handlers = composeWidgetTrackingHandlers(
        { routeSelected: { action: TrackingAction.OnRouteSelected } },
        ctx,
      );
      await handlers.routeSelected!({ route, routes: [route] });
      expect(ctx.tracking.trackTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          action: TrackingAction.OnRouteSelected,
          label: 'route_selected',
        }),
      );
    });

    it('is not defined when routeSelected config is absent', () => {
      const handlers = composeWidgetTrackingHandlers({}, makeContext());
      expect(handlers.routeSelected).toBeUndefined();
    });
  });

  describe('chainPinned', () => {
    it('calls trackEvent with correct action', async () => {
      const ctx = makeContext();
      const handlers = composeWidgetTrackingHandlers(
        { chainPinned: { action: TrackingAction.OnChainPinned } },
        ctx,
      );
      await handlers.chainPinned!({
        chainId: 1,
        pinned: true,
        direction: 'from',
      } as never);
      expect(ctx.tracking.trackEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: TrackingAction.OnChainPinned,
          label: 'chain_pinned',
        }),
      );
    });

    it('merges extraData into the event data', async () => {
      const ctx = makeContext();
      const handlers = composeWidgetTrackingHandlers(
        {
          chainPinned: {
            action: TrackingAction.OnChainPinned,
            extraData: { foo: 'bar' },
          },
        },
        ctx,
      );
      await handlers.chainPinned!({
        chainId: 1,
        pinned: false,
        direction: 'to',
      } as never);
      expect(ctx.tracking.trackEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ foo: 'bar' }),
        }),
      );
    });

    it('is not defined when chainPinned config is absent', () => {
      const handlers = composeWidgetTrackingHandlers({}, makeContext());
      expect(handlers.chainPinned).toBeUndefined();
    });
  });

  describe('private widget scenario', () => {
    it('only includes the 4 private events and no posthog-specific handlers', () => {
      const config = createWidgetTrackerConfig('private');
      const handlers = composeWidgetTrackingHandlers(config, makeContext());
      expect(handlers.availableRoutes).toBeDefined();
      expect(handlers.routeExecutionStarted).toBeDefined();
      expect(handlers.routeExecutionCompleted).toBeDefined();
      expect(handlers.routeExecutionFailed).toBeDefined();
      expect(handlers.routeSelected).toBeUndefined();
      expect(handlers.chainPinned).toBeUndefined();
      expect(handlers.sourceChainTokenSelected).toBeUndefined();
      expect(handlers.destinationChainTokenSelected).toBeUndefined();
      expect(handlers.settingUpdated).toBeUndefined();
    });
  });
});

describe('createWidgetTrackerConfig', () => {
  it('builds the main widget config with all public events', () => {
    const config: WidgetEventTrackerConfig = createWidgetTrackerConfig('main');
    expect(config.sourceChainAndTokenSelection?.action).toBe(
      TrackingAction.OnSourceChainAndTokenSelection,
    );
    expect(config.routeExecutionUpdated).toBeDefined();
    expect(config.routeHighValueLoss).toBeDefined();
    expect(config.formFieldChanged).toBeDefined();
  });

  it('builds the zap variant with routeSelected and chainPinned', () => {
    const config = createWidgetTrackerConfig('zap');
    expect(config.sourceChainAndTokenSelection?.action).toBe(
      TrackingAction.OnSourceChainAndTokenSelectionZap,
    );
    expect(config.routeSelected?.action).toBe(TrackingAction.OnRouteSelected);
    expect(config.chainPinned?.action).toBe(TrackingAction.OnChainPinned);
  });

  it('builds earnWithdraw with destination selection instead of source', () => {
    const config = createWidgetTrackerConfig('earnWithdraw');
    expect(config.destinationChainAndTokenSelection?.action).toBe(
      TrackingAction.OnDestinationChainAndTokenSelectionEarnWithdraw,
    );
    expect(config.sourceChainAndTokenSelection).toBeUndefined();
  });
});
