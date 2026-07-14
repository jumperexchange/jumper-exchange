import type { Theme } from '@mui/material/styles';
import type {
  NavigationTabKey,
  Route,
  RouteLabelRule,
} from '@jumperexchange/widget';
import { ChainType } from '@jumperexchange/widget';
import type { StarterVariantType } from '@/types/internal';
import type { WidgetFeatureFlags, WidgetVariantDescriptor } from './types';

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
