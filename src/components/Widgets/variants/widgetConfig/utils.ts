import type { Theme } from '@mui/material/styles';
import type {
  FormState,
  NavigationTabKey,
  Route,
  RouteLabelRule,
} from '@jumperexchange/widget';
import { ChainId, ChainType } from '@jumperexchange/widget';
import { ETH_NATIVE, ETH_USDC, SOL_USDC } from '@/config/tokens';
import type { StarterVariantType } from '@/types/internal';
import type { LimitOrder } from '@/types/jumper-backend';
import { useWidgetCacheStore } from '@/stores/widgetCache';
import type {
  FormData,
  WidgetFeatureFlags,
  WidgetType,
  WidgetVariantDescriptor,
} from './types';

const WIDGET_VARIANT_REGISTRY: Record<string, WidgetVariantDescriptor> = {
  default: {
    key: 'default',
    uiVariant: 'wide',
    mode: 'default',
    navigationTabs: ['default', 'refuel'],
  },
  advanced: {
    key: 'advanced',
    uiVariant: 'wide',
    mode: 'default',
    navigationTabs: ['swap-advanced', 'bridge-advanced'],
  },
  swap: { key: 'swap', uiVariant: 'compact', mode: 'default' },
  bridge: { key: 'bridge', uiVariant: 'compact', mode: 'default' },
  blog: { key: 'blog', uiVariant: 'compact', mode: 'default' },
  refuel: { key: 'refuel', uiVariant: 'wide', mode: 'refuel' },
  limit: { key: 'limit', uiVariant: 'compact', mode: 'limit' },
  private: {
    key: 'private',
    uiVariant: 'wide',
    mode: 'default',
    navigationTabs: ['private'],
  },
};

export function resolveWidgetVariant(
  starterVariant: StarterVariantType,
  flags: WidgetFeatureFlags,
): WidgetVariantDescriptor {
  const base =
    WIDGET_VARIANT_REGISTRY[starterVariant] ??
    WIDGET_VARIANT_REGISTRY['default']!;

  if (starterVariant === 'advanced' && !flags.widgetAdvanced) {
    return WIDGET_VARIANT_REGISTRY['default']!;
  }

  if (starterVariant === 'advanced' && flags.limitOrders) {
    return {
      ...base,
      navigationTabs: [
        ...((base.navigationTabs ?? []) as NavigationTabKey[]),
        'limit',
      ],
    };
  }

  if (starterVariant === 'default' && flags.privateSwaps) {
    const tabs = (base.navigationTabs ?? []) as NavigationTabKey[];
    return {
      ...base,
      navigationTabs: [tabs[0]!, 'private', ...tabs.slice(1)],
    };
  }

  return base;
}

export interface ResolveActiveNavigationTabParams {
  type: WidgetType;
  resolvedVariant?: WidgetVariantDescriptor;
  /** Raw value from the shared, module-level useActiveNavigationTab() subscription. */
  globalActiveNavigationTab?: NavigationTabKey | null;
}

/**
 * useActiveNavigationTab() subscribes to a module-level singleton shared by
 * every <LiFiWidget> instance on the page, but only the main tabbed widget
 * ever emits NavigationTabChanged. Every other instance (limit-order modals,
 * zap widgets) must not treat that global value as its own — otherwise it
 * inherits the main widget's tab and resolves keyPrefix/apiUrl from a signal
 * that isn't meaningful for it.
 */
export function resolveActiveNavigationTab({
  type,
  resolvedVariant,
  globalActiveNavigationTab,
}: ResolveActiveNavigationTabParams): NavigationTabKey | undefined {
  const navigationTabs = resolvedVariant?.navigationTabs;
  const ownsNavigationTabs = type === 'main' && !!navigationTabs?.length;

  if (!ownsNavigationTabs) {
    return undefined;
  }

  return navigationTabs!.includes(globalActiveNavigationTab as NavigationTabKey)
    ? (globalActiveNavigationTab as NavigationTabKey)
    : navigationTabs![0];
}

/**
 * Only the limit and private tabs need their own widget form-state namespace
 * (they're functionally distinct flows). Every other in-widget tab
 * (swap-advanced, bridge-advanced, refuel, ...) shares the variant's own key,
 * so switching between them doesn't reset the widget's in-progress form.
 */
export function resolveWidgetKeyPrefix(
  key: string,
  activeTabKey?: NavigationTabKey,
): string {
  return activeTabKey === 'limit' || activeTabKey === 'private'
    ? activeTabKey
    : key;
}

export interface WidgetPlaceholderTokens {
  fromChain: number;
  fromToken: string;
  toChain: number;
  toToken: string;
}

const ethUsdcToSolUsdc = (): WidgetPlaceholderTokens => ({
  fromChain: ChainId.ETH,
  fromToken: ETH_USDC,
  toChain: ChainId.SOL,
  toToken: SOL_USDC,
});

const ethNativeToEthUsdc = (): WidgetPlaceholderTokens => ({
  fromChain: ChainId.ETH,
  fromToken: ETH_NATIVE,
  toChain: ChainId.ETH,
  toToken: ETH_USDC,
});

/** Limit protocols (CoW / 1inch) do not support native ETH as the sell token. */
const ethUsdcToEthNative = (): WidgetPlaceholderTokens => ({
  fromChain: ChainId.ETH,
  fromToken: ETH_USDC,
  toChain: ChainId.ETH,
  toToken: ETH_NATIVE,
});

/**
 * Default from/to pair when the widget has no higher-priority source
 * (partner theme, props, or URL). Private and Gas stay empty.
 */
export const resolveWidgetPlaceholderTokens = (
  starterVariant: StarterVariantType,
  activeTabKey?: NavigationTabKey | null,
): WidgetPlaceholderTokens | undefined => {
  if (
    activeTabKey === 'refuel' ||
    activeTabKey === 'private' ||
    starterVariant === 'refuel' ||
    starterVariant === 'private'
  ) {
    return undefined;
  }

  if (activeTabKey === 'swap-advanced') {
    return ethNativeToEthUsdc();
  }

  if (activeTabKey === 'limit') {
    return ethUsdcToEthNative();
  }

  if (activeTabKey === 'bridge-advanced') {
    return ethUsdcToSolUsdc();
  }

  if (activeTabKey === 'default') {
    return ethUsdcToSolUsdc();
  }

  if (starterVariant === 'default' && !activeTabKey) {
    return ethUsdcToSolUsdc();
  }

  if (starterVariant === 'advanced' && !activeTabKey) {
    return ethNativeToEthUsdc();
  }

  return undefined;
};

/** Parses a chain id query value; rejects NaN / non-finite junk. */
const parseUrlChainId = (raw: string | null): number | undefined => {
  if (raw == null || raw === '') {
    return undefined;
  }
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
};

/** Synchronous URL read for cold-load deep links. */
export const getUrlChainTokenParams = () => {
  if (typeof window === 'undefined') {
    return {};
  }

  const query = new URLSearchParams(window.location.search);
  const fromChainRaw = query.get('fromChain');
  const toChainRaw = query.get('toChain');
  const fromChain = parseUrlChainId(fromChainRaw);
  const toChain = parseUrlChainId(toChainRaw);

  // Junk chain params (e.g. fromChain=abc → NaN) must not block placeholders.
  // Drop the matching token when the chain query was present but invalid.
  const fromTokenRaw = query.get('fromToken') ?? undefined;
  const toTokenRaw = query.get('toToken') ?? undefined;

  return {
    fromChain,
    fromToken:
      fromChainRaw != null && fromChain === undefined
        ? undefined
        : fromTokenRaw,
    toChain,
    toToken:
      toChainRaw != null && toChain === undefined ? undefined : toTokenRaw,
  };
};

export const clearWidgetChainTokenCache = () => {
  useWidgetCacheStore.setState({
    fromToken: undefined,
    fromChainId: undefined,
    toToken: undefined,
    toChainId: undefined,
  });
};

/** Clears from/to query params (e.g. after an intentional form reset). */
export const clearUrlChainTokenParams = () => {
  if (typeof window === 'undefined') {
    return;
  }

  const url = new URL(window.location.href);
  let changed = false;
  for (const key of [
    'fromChain',
    'fromToken',
    'toChain',
    'toToken',
    'fromAmount',
  ] as const) {
    if (url.searchParams.has(key)) {
      url.searchParams.delete(key);
      changed = true;
    }
  }
  if (changed) {
    window.history.replaceState(window.history.state, '', url);
  }
};

/** Writes from/to query params so URL-driven UI (e.g. Market Price) matches the form. */
export const writeUrlChainTokenParams = (
  tokens: WidgetPlaceholderTokens | null,
) => {
  if (typeof window === 'undefined') {
    return;
  }

  if (!tokens) {
    clearUrlChainTokenParams();
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.set('fromChain', String(tokens.fromChain));
  url.searchParams.set('fromToken', tokens.fromToken);
  url.searchParams.set('toChain', String(tokens.toChain));
  url.searchParams.set('toToken', tokens.toToken);
  window.history.replaceState(window.history.state, '', url);
};

/**
 * Simple ↔ Advanced: destination Widget clears URL + cache once on mount so
 * the departing page's buildUrl leftovers do not seed the new surface.
 * No form-seed suppress on the departing page.
 */
let surfaceHandoffGeneration = 0;
let consumedSurfaceHandoffGeneration = 0;

export const prepareWidgetSurfaceNavigation = () => {
  surfaceHandoffGeneration += 1;
  clearWidgetChainTokenCache();
};

export const consumeWidgetSurfaceNavigation = () => {
  if (
    surfaceHandoffGeneration === 0 ||
    consumedSurfaceHandoffGeneration === surfaceHandoffGeneration
  ) {
    return;
  }
  consumedSurfaceHandoffGeneration = surfaceHandoffGeneration;
  clearUrlChainTokenParams();
  clearWidgetChainTokenCache();
};

/** Writes from/to into the live FormStore without remounting the widget. */
export const applyWidgetChainTokenFields = (
  form: FormState | null | undefined,
  tokens: WidgetPlaceholderTokens | null,
) => {
  if (!form) {
    return;
  }

  if (tokens) {
    form.setFieldValue('fromChain', tokens.fromChain);
    form.setFieldValue('fromToken', tokens.fromToken);
    form.setFieldValue('toChain', tokens.toChain);
    form.setFieldValue('toToken', tokens.toToken);
  } else {
    form.setFieldValue('fromChain', undefined);
    form.setFieldValue('fromToken', undefined);
    form.setFieldValue('toChain', undefined);
    form.setFieldValue('toToken', undefined);
  }

  // Config/form seed does not always flow into the query string; URL-driven
  // panels (Market Price) need an explicit sync.
  writeUrlChainTokenParams(tokens);
};

export const generateRouteLabel = (
  text: string,
  theme: Theme,
  backgroundImage?: string,
  allowExchange?: string,
  match?: (route: Route) => boolean,
  variant: 'gradient' | 'neutral' = 'gradient',
): RouteLabelRule => {
  const isNeutral = variant === 'neutral';
  return {
    label: {
      text: text,
      sx: {
        order: 1,
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        marginLeft: 'auto',
        gap: theme.spacing(0.5),
        paddingLeft: theme.spacing(0.5),
        paddingRight: theme.spacing(0.5),
        background: isNeutral
          ? `${(theme.vars || theme).palette.badgeAccent1MutedBg} !important`
          : `linear-gradient(90deg, ${(theme.vars || theme).palette.orchid[600]} 0%, ${(theme.vars || theme).palette.lavenderDark[300]} 100%)`,
        color: isNeutral
          ? (theme.vars || theme).palette.badgeAccent1MutedFg
          : (theme.vars || theme).palette.white.main,
        ...theme.typography.bodyXSmallStrong,
        ...(isNeutral
          ? {}
          : theme.applyStyles('light', {
              // @Note we might adjust to use the theme config
              background: 'linear-gradient(90deg, #9B006F 0%, #37006B 100%)',
            })),
        '&::before': {
          content: '""',
          width: '16px',
          height: '16px',
          borderRadius: '50%', // Makes the icon circular
          flexShrink: 0,
          ...(isNeutral && backgroundImage
            ? {
                // Recolor the icon to match the label text color (white in dark mode)
                backgroundColor: 'currentColor',
                maskImage: `url(${backgroundImage})`,
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskImage: `url(${backgroundImage})`,
                WebkitMaskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
              }
            : {
                backgroundImage: backgroundImage
                  ? `url(${backgroundImage})`
                  : undefined,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }),
        },
        '&>p': {
          alignContent: 'flex-end',
          paddingLeft: theme.spacing(0.5),
          paddingRight: theme.spacing(0.5),
        },
      },
    },
    match: match,
    exchanges: allowExchange
      ? {
          allow: [allowExchange],
        }
      : undefined,
  };
};

export const isSupportedChainType = (
  type?: ChainType | null | undefined,
): type is ChainType.EVM | ChainType.SVM => {
  return !!type && [ChainType.EVM, ChainType.SVM].includes(type);
};

/** Container style for the limit-order modify/repeat flow modals' embedded widget. */
export const getOrderFlowWidgetContainerStyle = (theme: Theme) => ({
  maxHeight: 'calc(100vh - 6rem)',
  minWidth: 'min(100vw, 360px)',
  maxWidth: 400,
  borderRadius: `${theme.shape.cardBorderRadiusLarge}px`,
  [theme.breakpoints.up('sm')]: {
    maxHeight: 'calc(100vh - 6rem)',
    minWidth: 400,
  },
});

/** Shared formData builder for the limit-order modify/repeat flow modals. */
export const buildOrderFlowFormData = (
  order: LimitOrder,
  toAmount: (raw: bigint, decimals: number) => string,
): FormData => {
  const fromAmount = toAmount(
    BigInt(order.fromAmount),
    order.fromToken.decimals,
  );
  const toAmountValue = toAmount(
    BigInt(order.toAmount),
    order.toToken.decimals,
  );
  return {
    sourceChain: {
      chainId: order.fromToken.chainId.toString(),
      chainKey: '',
    },
    sourceToken: {
      tokenAddress: order.fromToken.address,
      tokenSymbol: order.fromToken.symbol,
    },
    destinationChain: {
      chainId: order.toToken.chainId.toString(),
      chainKey: '',
    },
    destinationToken: {
      tokenAddress: order.toToken.address,
      tokenSymbol: order.toToken.symbol,
    },
    fromAmount,
    limitPrice: (Number(toAmountValue) / Number(fromAmount)).toString(),
  };
};
