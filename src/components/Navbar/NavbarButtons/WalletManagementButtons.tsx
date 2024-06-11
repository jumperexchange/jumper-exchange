'use client';
import { EcosystemSelectMenu } from '@/components/Menus/EcosystemSelectMenu';
import { WalletMenu } from '@/components/Menus/WalletMenu';
import { WalletSelectMenu } from '@/components/Menus/WalletSelectMenu';
import { Typography } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { TrackingAction, TrackingCategory } from 'src/const/trackingKeys';
import { JUMPER_LEARN_PATH } from 'src/const/urls';
import { useUserTracking } from 'src/hooks/userTracking';
import { EventTrackingTool } from 'src/types/userTracking';
import { WallettButtons } from '../WalletButton';
import { ConnectButton } from './WalletManagementButtons.style';

interface WalletManagementButtonsProps {
  children?: React.ReactNode;
  backgroundColor?: string;
  color?: string;
  walletConnected?: boolean;
}

export const WalletManagementButtons: React.FC<
  WalletManagementButtonsProps
> = () => {
  const walletManagementButtonsRef = useRef<any>();
  const { t } = useTranslation();
  const router = useRouter();
  const { trackEvent } = useUserTracking();

  const pathname = usePathname();
  const redirectToApp = pathname?.includes(JUMPER_LEARN_PATH);

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
      <div ref={walletManagementButtonsRef}>
        {redirectToApp ? (
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
      </div>
      <WalletMenu anchorEl={walletManagementButtonsRef.current} />
      <WalletSelectMenu anchorEl={walletManagementButtonsRef.current} />
      <EcosystemSelectMenu anchorEl={walletManagementButtonsRef.current} />
    </>
  );
};
