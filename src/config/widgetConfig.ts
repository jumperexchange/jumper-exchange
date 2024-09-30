import { createConfig } from '@lifi/sdk';
import type { WidgetConfig } from '@lifi/widget';
import type { Breakpoint, Theme } from '@mui/material';
import { publicRPCList } from './../const/rpcList';

createConfig({
  apiUrl: process.env.NEXT_PUBLIC_LIFI_API_URL,
  integrator: process.env.NEXT_PUBLIC_WIDGET_INTEGRATOR,
  rpcUrls: {
    ...JSON.parse(process.env.NEXT_PUBLIC_CUSTOM_RPCS),
    ...publicRPCList,
  },
  preloadChains: false,
});

export const getDefaultWidgetTheme = (
  theme: Theme,
): { config: Partial<WidgetConfig> } => ({
  config: {
    appearance: theme.palette.mode,
    theme: {
      // @ts-expect-error
      typography: {
        fontFamily: theme.typography.fontFamily,
      },
      container: {
        borderRadius: '12px',
        maxWidth: '100%',
        [theme.breakpoints.up('sm' as Breakpoint)]: {
          borderRadius: '12px',
          maxWidth: 416,
          minWidth: 416,
          boxShadow:
            theme.palette.mode === 'light'
              ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
              : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
        },
      },
      shape: {
        borderRadius: 12,
        borderRadiusSecondary: 24,
      },
      palette: {
        background: {
          paper: theme.palette.surface2.main,
          default: theme.palette.surface1.main,
        },
        primary: {
          main: theme.palette.accent1.main,
        },
        secondary: {
          main: theme.palette.accent2.main,
        },
        grey: theme.palette.grey,
      },
    },
  },
});
