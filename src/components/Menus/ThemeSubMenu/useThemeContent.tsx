'use client';

import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { useTranslation } from 'react-i18next';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const/trackingKeys';

export const useThemeContent = () => {
  const { i18n } = useTranslation();
  const { trackEvent } = useUserTracking();
  const handleThemeSwitch = (theme: string) => {
    trackEvent({
      category: TrackingCategory.LanguageMenu,
      action: TrackingAction.SwitchLanguage,
      label: `theme_${theme}`,
      data: { [TrackingEventParameter.SwitchedTemplate]: theme },
    });
    console.log('Change theme to:', theme);
  };

  const themes = [
    {
      label: 'Windows 95',
      onClick: () => {
        handleThemeSwitch('windows 95');
      },
    },
  ];

  return themes;
};
