import type { Theme } from '@mui/material/styles';
import type { Route, RouteLabelRule } from '@lifi/widget';
import { ChainType } from '@lifi/widget';

export const generateRouteLabel = (
  text: string,
  theme: Theme,
  backgroundImage?: string,
  allowExchange?: string,
  match?: (route: Route) => boolean,
): RouteLabelRule => {
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
        background: `linear-gradient(90deg, ${(theme.vars || theme).palette.orchid[600]} 0%, ${(theme.vars || theme).palette.lavenderDark[300]} 100%)`,
        color: (theme.vars || theme).palette.white.main,
        ...theme.typography.bodyXSmallStrong,
        ...theme.applyStyles('light', {
          // @Note we might adjust to use the theme config
          background: 'linear-gradient(90deg, #9B006F 0%, #37006B 100%)',
        }),
        '&::before': {
          content: '""',
          width: '16px',
          height: '16px',
          borderRadius: '50%', // Makes the icon circular
          backgroundImage: backgroundImage
            ? `url(${backgroundImage})`
            : undefined,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          flexShrink: 0,
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
