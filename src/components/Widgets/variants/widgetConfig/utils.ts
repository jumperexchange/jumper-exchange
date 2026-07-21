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
                top: 'calc(100% + 4px)',
                // Anchor to the label's right edge (the badge is right-aligned)
                // so the bubble extends leftward and stays inside the card.
                right: 0,
                width: 'max-content',
                maxWidth: 240,
                whiteSpace: 'normal',
                textAlign: 'center',
                padding: theme.spacing(1),
                borderRadius: `${theme.shape.radius12}px`,
                backgroundColor: (theme.vars || theme).palette.grey[900],
                color: (theme.vars || theme).palette.textPrimaryInverted,
                boxShadow: theme.shadows[3],
                ...theme.typography.bodyXSmall,
                opacity: 0,
                visibility: 'hidden',
                pointerEvents: 'none',
                transition: 'opacity 150ms ease, visibility 150ms ease',
                zIndex: theme.zIndex.tooltip,
                ...theme.applyStyles('light', {
                  backgroundColor: (theme.vars || theme).palette.grey[700],
                  color: (theme.vars || theme).palette.textPrimaryInverted,
                }),
              },
              // Arrow pointing up from the bubble toward the badge. The label's
              // own ::before/::after are already used (icon + bubble), so the
              // arrow is drawn on the text node's ::after, which shares the
              // label's positioning context.
              '&>p::after': {
                content: '""',
                position: 'absolute',
                // Sits in the gap between the badge and the bubble: tip just
                // below the badge, base meeting the bubble's top edge.
                top: 'calc(100% - 1px)',
                right: 'calc(50%)',
                transform: 'translateX(50%)',
                width: 0,
                height: 0,
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderBottom: `5px solid`,
                borderBottomColor: (theme.vars || theme).palette.grey[900],
                ...theme.applyStyles('light', {
                  borderBottomColor: (theme.vars || theme).palette.grey[700],
                }),
                opacity: 0,
                visibility: 'hidden',
                pointerEvents: 'none',
                transition: 'opacity 150ms ease, visibility 150ms ease',
                zIndex: theme.zIndex.tooltip,
              },
              '&:hover::after, &:focus-visible::after, &:focus-within::after, &:hover>p::after, &:focus-visible>p::after, &:focus-within>p::after':
                {
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
