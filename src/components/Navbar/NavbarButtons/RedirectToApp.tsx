'use client';
import { Typography, useTheme } from '@mui/material';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { TrackingAction, TrackingCategory } from 'src/const/trackingKeys';
import { useUserTracking } from 'src/hooks/userTracking';
import { ConnectButton as RedirectAppButton } from '../WalletButton.style';

interface RedirectToAppProps {
  hideConnectButton: boolean;
}

export const RedirectToApp = ({ hideConnectButton }: RedirectToAppProps) => {
  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();
  const theme = useTheme();

  const handleOpenApp = () => {
    trackEvent({
      category: TrackingCategory.WalletSelectMenu,
      action: TrackingAction.ClickConnectToWidget,
      label: 'click_connect_wallet_on_jumper_learn',
    });
  };

  return (
    <RedirectAppButton
      // Used in the widget
      component={Link}
      href={'/'}
      onClick={handleOpenApp}
      sx={{
        ...(!hideConnectButton && { marginRight: theme.spacing(1) }),
      }}
    >
      <Typography
        variant={'bodyMediumStrong'}
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {t('blog.openApp')}
      </Typography>
    </RedirectAppButton>
  );
};
