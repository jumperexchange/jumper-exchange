import { useMemo } from 'react';
import { WidgetConfig } from '@lifi/widget';
import { useTheme } from '@mui/material/styles';

import { ConfigContext } from '../types';

export const useRouteLabels = (ctx: ConfigContext) => {
  const theme = useTheme();
  const config: Partial<WidgetConfig> = useMemo(() => {
    return {
      routeLabels: [
        {
          label: {
            text: '1.5x points',
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
                backgroundImage:
                  'url(https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/exchanges/hyperbloom.svg)',
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
          exchanges: {
            allow: ['hyperbloom'],
          },
        },
        {
          label: {
            text: '1.5x points',
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
                backgroundImage:
                  'url(https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/exchanges/hyperflow.svg)',
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
          exchanges: {
            allow: ['hyperflow'],
          },
        },
      ],
    };
  }, [theme]);

  return config;
};
