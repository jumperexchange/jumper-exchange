'use client';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { TrackingAction, TrackingCategory } from 'src/const/trackingKeys';
import { useUserTracking } from 'src/hooks/userTracking';
import { AppPaths } from 'src/const/urls';
import {
  RedirectAppNavbarButton,
  RedirectAppLabel,
  RedirectAppIcon,
} from './Buttons.style';

export const RedirectToApp = () => {
  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();

  const handleOpenApp = () => {
    trackEvent({
      category: TrackingCategory.WalletSelectMenu,
      action: TrackingAction.ClickConnectToWidget,
      label: 'click_connect_wallet_on_jumper_learn',
    });
  };

  return (
    <RedirectAppNavbarButton
      component={Link}
      href={AppPaths.Main}
      onClick={handleOpenApp}
    >
      <RedirectAppIcon />
      <RedirectAppLabel
        sx={{
          typography: {
            xs: 'bodyXSmallStrong',
            sm: 'bodySmallStrong',
          },
        }}
      >
        {t('blog.openApp')}
      </RedirectAppLabel>
    </RedirectAppNavbarButton>
  );
};
