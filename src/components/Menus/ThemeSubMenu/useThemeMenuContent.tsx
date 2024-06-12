import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';
import { STRAPI_PARTNER_THEMES } from 'src/const/strapiContentKeys';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const/trackingKeys';
import { useStrapi } from 'src/hooks/useStrapi';
import { useSettingsStore } from 'src/stores/settings';
import type { PartnerThemesData } from 'src/types/strapi';

export const useThemeMenuContent = () => {
  const { i18n } = useTranslation();
  const { trackEvent } = useUserTracking();
  const setPartnerTheme = useSettingsStore((state) => state.setPartnerThemeUid);
  const [themeMode, setThemeMode] = useSettingsStore((state) => [
    state.themeMode,
    state.setThemeMode,
  ]);
  const [, setCookie] = useCookies(['theme']);
  const { data: partnerThemes, isSuccess } = useStrapi<PartnerThemesData>({
    contentType: STRAPI_PARTNER_THEMES,
    queryKey: ['partner-themes'],
  });
  console.log('partnerThemes', partnerThemes);
  const handleThemeSwitch = (theme: PartnerThemesData | undefined) => {
    trackEvent({
      category: TrackingCategory.ThemesMenu,
      action: TrackingAction.SwitchThemeTemplate,
      label: `theme_${theme ?? 'default'}`,
      data: {
        [TrackingEventParameter.SwitchedTemplate]:
          theme?.attributes.PartnerName.replace(' ', '') ?? 'default',
      },
    });
    setPartnerTheme(theme?.attributes.uid);
    console.log('handle theme switch');
    console.log('theme', theme);

    if (!theme?.attributes.darkModeEnabled) {
      console.log('set theme mode dark');
      setThemeMode('dark');
    }
    console.log('Change theme to:', theme?.attributes.PartnerName || 'default');
    console.log('Change theme UID:', theme?.attributes.uid || 'none');
  };

  const themes: any = [
    {
      label: 'Default',
      onClick: () => {
        handleThemeSwitch(undefined);
      },
    },
  ];

  partnerThemes?.map((el) =>
    themes.push({
      label: el.attributes.PartnerName,
      onClick: () => {
        handleThemeSwitch(el);
      },
    }),
  );

  return { themes: themes, isSuccess };
};
