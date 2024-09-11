import { useSettingsStore } from '@/stores/settings';
import { formatTheme } from '@/utils/formatTheme';
import type { WidgetConfig } from '@lifi/widget';
import type { Breakpoint } from '@mui/material';
import { useTheme } from '@mui/material';
import { deepmerge } from '@mui/utils';
import { useTheme as useNextTheme } from 'next-themes';
import { useEffect } from 'react';
import type { PartnerTheme } from 'src/types/strapi';

export const useWidgetTheme = (): PartnerTheme => {
  const theme = useTheme();
  const { resolvedTheme, forcedTheme } = useNextTheme();
  const [widgetTheme, setWidgetTheme, partnerThemes] = useSettingsStore(
    (state) => [state.widgetTheme, state.setWidgetTheme, state.partnerThemes],
  );

  const activeNextTheme = forcedTheme || resolvedTheme;

  const defaultWidgetTheme: { config: Partial<WidgetConfig> } = {
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
  };

  useEffect(() => {
    const theme = partnerThemes?.find(
      (d) => d.attributes.uid === activeNextTheme,
    );

    if (!theme) {
      setWidgetTheme(defaultWidgetTheme);
      return;
    }

    const formattedTheme = formatTheme(theme.attributes);

    setWidgetTheme({
      config: deepmerge(
        defaultWidgetTheme.config,
        formattedTheme.activeWidgetTheme,
      ),
    });
  }, [activeNextTheme, partnerThemes, theme]); // todo: check dep array

  return widgetTheme || defaultWidgetTheme;
};
