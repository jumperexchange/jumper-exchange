import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { useTranslation } from 'react-i18next';
import { STRAPI_PARTNER_THEMES } from 'src/const/strapiContentKeys';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const/trackingKeys';
import { useStrapi } from 'src/hooks/useStrapi';
import { validThemes } from 'src/hooks/useWelcomeScreen';
import type { PartnerThemesData } from 'src/types/strapi';
import { useSettingsStore } from '@/stores/settings';
import { useColorScheme } from '@mui/material';

export const useThemeMenuContent = () => {
  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();
  const { mode, setMode } = useColorScheme();
  const setWelcomeScreenClosed = useSettingsStore(
    (state) => state.setWelcomeScreenClosed,
  );

  const { data: partnerThemes, isSuccess } = useStrapi<PartnerThemesData>({
    contentType: STRAPI_PARTNER_THEMES,
    queryKey: ['partner-themes'],
  });

  const handleThemeSwitch = (theme: string) => {
    trackEvent({
      category: TrackingCategory.ThemesMenu,
      action: TrackingAction.SwitchThemeTemplate,
      label: `theme_${theme ?? 'default'}`,
      data: {
        [TrackingEventParameter.SwitchedTemplate]: theme,
      },
    });
    if (!validThemes.includes(theme)) {
      setWelcomeScreenClosed(true);

      throw new Error('Deprecated, need to be re-implemented');
    }
    // setMode(theme);
  };

  const themes: any = [
    {
      label: t('navbar.themes.default'),
      onClick: () => {
        handleThemeSwitch('system');
      },
      checkIcon:
        mode === 'dark' ||
        mode === 'light' ||
        mode === undefined,
    },
  ];

  partnerThemes?.map(
    (el) =>
      el?.SelectableInMenu &&
      themes.push({
        label: el?.PartnerName,
        onClick: () => {
          handleThemeSwitch(el?.uid);
        },
        checkIcon: mode === el?.uid,
      }),
  );

  return { themes: themes, isSuccess };
};
