'use client';
import { EcosystemSelectMenu } from '@/components/Menus/EcosystemSelectMenu';
import { WalletMenu } from '@/components/Menus/WalletMenu';
import { WalletSelectMenu } from '@/components/Menus/WalletSelectMenu';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { TrackingAction, TrackingCategory } from 'src/const/trackingKeys';
import { useUserTracking } from 'src/hooks/userTracking';
import { EventTrackingTool } from 'src/types/userTracking';
import { WallettButtons } from '../WalletButton';
import { ConnectButton } from './WalletManagementButtons.style';

interface WalletManagementButtonsProps {
  redirectToLearn?: boolean;
}

export const WalletManagementButtons = ({
  redirectToLearn,
}: WalletManagementButtonsProps) => {
  const walletManagementButtonsRef = useRef<HTMLAnchorElement>(null);
  const { t } = useTranslation();
  const router = useRouter();
  const { trackEvent } = useUserTracking();

  const handleLearnButton = () => {
    router.push('/');
    trackEvent({
      category: TrackingCategory.WalletSelectMenu,
      action: TrackingAction.ClickConnectToWidget,
      label: 'click_connect_wallet_on_jumper_learn',
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Cookie3],
    });
  };

  return (
    <>
      <Box ref={walletManagementButtonsRef}>
        {redirectToLearn ? (
          <ConnectButton
            // Used in the widget
            onClick={handleLearnButton}
          >
            <Typography
              variant={'lifiBodyMediumStrong'}
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
        ) : (
          <WallettButtons />
        )}
      </Box>
      <WalletMenu anchorEl={walletManagementButtonsRef.current ?? undefined} />
      <WalletSelectMenu
        anchorEl={walletManagementButtonsRef.current || undefined}
      />
      <EcosystemSelectMenu
        anchorEl={walletManagementButtonsRef?.current || undefined}
      />
    </>
  );
};
