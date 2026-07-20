import type { Theme } from '@mui/material/styles';
import type { Route, RouteLabelRule } from '@lifi/widget';
import { ChainType } from '@lifi/widget';

export const generateRouteLabel = (
  text: string,
  theme: Theme,
  backgroundImage?: string,
  allowExchange?: string,
  match?: (route: Route) => boolean,
  variant: 'gradient' | 'neutral' = 'gradient',
  tooltipText?: string,
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
        // Allow the CSS tooltip pseudo-element to escape the label bounds.
        overflow: tooltipText ? 'visible' : 'hidden',
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
        // The widget renders custom route labels without tooltip support
        // (RouteLabel only exposes `text` + `sx`), so the explanation is
        // surfaced through a CSS tooltip on hover/focus, mirroring the core
        // Tooltip styling (dark surface, inverted text).
        ...(tooltipText
          ? {
              cursor: 'help',
              '&::after': {
                content: JSON.stringify(tooltipText),
                position: 'absolute',
                // Open downward: sibling route cards create their own stacking
                // contexts, so a bubble opening upward is painted behind the
                // card above. Below the badge it stays within this card.
                top: 'calc(100% + 8px)',
                // Anchor to the label's right edge (the badge is right-aligned)
                // so the bubble extends leftward and stays inside the card.
                right: 0,
                width: 'max-content',
                maxWidth: 240,
                whiteSpace: 'normal',
                textAlign: 'center',
                padding: theme.spacing(0.5, 1),
                borderRadius: theme.shape.borderRadius,
                backgroundColor: '#6d44ad',
                color: (theme.vars || theme).palette.white.main,
                fontSize: 12,
                lineHeight: 1.4,
                fontWeight: 500,
                boxShadow: theme.shadows[3],
                opacity: 0,
                visibility: 'hidden',
                pointerEvents: 'none',
                transition: 'opacity 150ms ease',
                zIndex: theme.zIndex.tooltip,
              },
              '&:hover::after, &:focus-visible::after, &:focus-within::after': {
                opacity: 1,
                visibility: 'visible',
              },
            }
          : {}),
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
