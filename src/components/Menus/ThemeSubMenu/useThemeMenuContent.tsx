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

export const useThemeMenuContent = () => {
  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();
  const [partnerThemeUid, setPartnerThemeUid] = useSettingsStore((state) => [
    state.partnerThemeUid,
    state.setPartnerThemeUid,
  ]);
  const setThemeMode = useSettingsStore((state) => state.setThemeMode);
  const { data: partnerThemes, isSuccess } = useStrapi<PartnerThemesData>({
    contentType: STRAPI_PARTNER_THEMES,
    queryKey: ['partner-themes'],
  });
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
    setPartnerThemeUid(theme?.attributes.uid);
    if (theme?.attributes.lightConfig && theme?.attributes.darkConfig) {
      setThemeMode('auto');
    } else if (theme?.attributes.darkConfig) {
      setThemeMode('dark');
    } else {
      setThemeMode('light');
    }
  };

  const themes: any = [
    {
      label: t('navbar.themes.default'),
      onClick: () => {
        handleThemeSwitch(undefined);
      },
      checkIcon: !partnerThemeUid,
    },
  ];

  partnerThemes?.map((el) =>
    themes.push({
      label: el.attributes.PartnerName,
      onClick: () => {
        handleThemeSwitch(el);
      },
      checkIcon: partnerThemeUid === el.attributes.uid,
    }),
  );

  return { themes: themes, isSuccess };
};
