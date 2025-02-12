import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { useTheme } from 'next-themes';
import { useCookies } from 'react-cookie';
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

export const useThemeMenuContent = () => {
  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();
  const { resolvedTheme, setTheme } = useTheme();

  const [, setCookie] = useCookies();
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
      setCookie('welcomeScreenClosed', true, {
        path: '/',
        sameSite: true,
      });
    }
    setTheme(theme);
  };

  const themes: any = [
    {
      label: t('navbar.themes.default'),
      onClick: () => {
        handleThemeSwitch('system');
      },
      checkIcon:
        resolvedTheme === 'dark' ||
        resolvedTheme === 'light' ||
        resolvedTheme === undefined,
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
        checkIcon: resolvedTheme === el?.uid,
      }),
  );

  return { themes: themes, isSuccess };
};
