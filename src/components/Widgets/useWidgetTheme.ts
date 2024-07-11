import { usePartnerTheme } from '@/hooks/usePartnerTheme';
import type { Breakpoint } from '@mui/material';
import { useTheme } from '@mui/material';
import { useTheme as useNextTheme } from 'next-themes';
import { darkTheme, lightTheme } from 'src/theme';
import type { PartnerTheme } from 'src/types/strapi';
import { useEffect, useState } from 'react';
import { getPartnerThemes } from '@/app/lib/getPartnerThemes';
import { formatTheme, getAvailableThemeMode } from '@/hooks/usePartnerThemeV2';
import { deepmerge } from '@mui/utils';

export const useWidgetTheme = (): PartnerTheme => {
  const theme = useTheme();
  const { resolvedTheme, forcedTheme } = useNextTheme();
  const [activeTheme, setActiveTheme] = useState();
  // const { hasTheme, isSuccess, currentWidgetTheme } = usePartnerTheme();

  const activeNextTheme = forcedTheme || resolvedTheme

  // console.log('resolve', resolvedTheme)

  const defaultWidgetTheme = {
    config: {
      appearance: theme.palette.mode,
      theme: {
        //todo: fix typography
        // typography: {
        //   fontFamily: theme.typography,
        // },
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
            // FIXME: we need to find out how to use the correct color from the main theme config
            // main: darkTheme.palette.accent2.main,
            main: theme.palette.secondary.main,
          },
          grey: theme.palette.grey,
        },
      },
    },
  };

  useEffect(() => {
    // console.log('widget resolved theme', resolvedTheme)

    if (['light', 'dark'].includes(activeNextTheme)) {
      // console.log('set back to default', defaultWidgetTheme)
      setActiveTheme();
      return;
    }

    getPartnerThemes()
      .then((data) => {
        const theme = data.data.find((d) => d.attributes.uid === activeNextTheme)

        if (!theme) {
          return;
        }

        const formattedTheme = formatTheme(theme.attributes)

        setActiveTheme({ ...defaultWidgetTheme, config: {
          theme: deepmerge(defaultWidgetTheme.config.theme, formattedTheme.activeWidgetTheme)
          }
        })
      })
  }, [activeNextTheme]);


  // console.log('sgessusewidgettheme', activeTheme, defaultWidgetTheme)

  if (!!activeTheme) {
    return activeTheme;
  } else {
    return defaultWidgetTheme;
  }
};
