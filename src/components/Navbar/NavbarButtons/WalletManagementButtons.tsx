'use client';
import { EcosystemSelectMenu } from '@/components/Menus/EcosystemSelectMenu';
import { WalletMenu } from '@/components/Menus/WalletMenu';
import { WalletSelectMenu } from '@/components/Menus/WalletSelectMenu';
import { Box, Typography, useTheme } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { TrackingAction, TrackingCategory } from 'src/const/trackingKeys';
import {
  JUMPER_LEARN_PATH,
  JUMPER_SCAN_PATH,
  JUMPER_TX_PATH,
  JUMPER_WALLET_PATH,
} from 'src/const/urls';
import { useUserTracking } from 'src/hooks/userTracking';
import { WalletButtons } from '../WalletButton';
import { ConnectButton } from './WalletManagementButtons.style';

export const WalletManagementButtons = () => {
  const walletManagementButtonsRef = useRef<HTMLAnchorElement>(null);
  const { t } = useTranslation();
  const router = useRouter();
  const { trackEvent } = useUserTracking();
  const theme = useTheme();

  const pathname = usePathname();
  const redirectToApp =
    pathname?.includes(JUMPER_LEARN_PATH) ||
    pathname?.includes(JUMPER_SCAN_PATH) ||
    pathname?.includes(JUMPER_TX_PATH) ||
    pathname?.includes(JUMPER_WALLET_PATH);

  const hideConnectButton = pathname?.includes(JUMPER_LEARN_PATH);

  const handleOpenApp = () => {
    router.push('/');
    trackEvent({
      category: TrackingCategory.WalletSelectMenu,
      action: TrackingAction.ClickConnectToWidget,
      label: 'click_connect_wallet_on_jumper_learn',
    });
  };

  return (
    <>
      <Box ref={walletManagementButtonsRef}>
        {redirectToApp && (
          <ConnectButton
            // Used in the widget
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
          </ConnectButton>
        )}
        {!hideConnectButton && <WalletButtons />}
      </Box>
      <WalletMenu anchorEl={walletManagementButtonsRef.current ?? undefined} />
      <WalletSelectMenu
        anchorEl={walletManagementButtonsRef.current || undefined}
      />
    </>
  );
};
