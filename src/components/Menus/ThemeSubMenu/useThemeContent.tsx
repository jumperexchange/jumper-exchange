import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
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

export const useThemeContent = () => {
  const { i18n } = useTranslation();
  const { trackEvent } = useUserTracking();
  const setPartnerTheme = useSettingsStore((state) => state.setPartnerTheme);

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
    setPartnerTheme(theme);
    console.log('Change theme to:', theme?.attributes.PartnerName || 'default');
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
