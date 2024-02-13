import type { Chain } from '@lifi/types';
import { getConnectorIcon } from '@lifi/wallet-management';
import { Typography } from '@mui/material';
import type { ReactElement } from 'react';
import React, { useMemo, useRef } from 'react';
import {
  ConnectButton,
  WalletMenu,
  WalletMenuButton,
  WalletMgmtBadge,
  WalletMgmtChainAvatar,
  WalletMgmtWalletAvatar,
  WalletSelectMenu,
} from 'src/components';
import { EcosystemSelectMenu } from 'src/components/Menus/EcosystemSelectMenu';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const';
import { useChains, useUserTracking } from 'src/hooks';
import { useAccounts } from 'src/hooks/useAccounts';
import { useMenuStore } from 'src/stores';
import { EventTrackingTool } from 'src/types';
import { walletDigest } from 'src/utils';

interface WalletManagementButtonsProps {
  children?: React.ReactNode;
  backgroundColor?: string;
  color?: string;
  walletConnected?: boolean;
  connectButtonLabel?: ReactElement<any, any>;
  isSuccess: boolean;
}

export const WalletManagementButtons: React.FC<
  WalletManagementButtonsProps
> = ({ connectButtonLabel, isSuccess }) => {
  const { chains } = useChains();
  const { trackEvent } = useUserTracking();
  const { accounts, account } = useAccounts();
  const walletManagementButtonsRef = useRef<any>();

  const {
    openWalletSelectMenu,
    setWalletSelectMenuState,
    openWalletMenu,
    setWalletMenuState,
  } = useMenuStore((state) => state);

  const handleWalletSelectClick = () => {
    !openWalletSelectMenu &&
      trackEvent({
        category: TrackingCategory.WalletSelectMenu,
        action: TrackingAction.OpenMenu,
        label: 'open_wallet_select_menu',
        data: { [TrackingEventParameter.Menu]: 'wallet_select_menu' },
        disableTrackingTool: [
          EventTrackingTool.ARCx,
          EventTrackingTool.Cookie3,
        ],
      });
    setWalletSelectMenuState(!openWalletSelectMenu);
  };

  const handleWalletMenuClick = () => {
    openWalletMenu &&
      trackEvent({
        category: TrackingCategory.WalletMenu,
        action: TrackingAction.OpenMenu,
        label: 'open_wallet_menu',
        data: { [TrackingEventParameter.Menu]: 'wallet_menu' },
        disableTrackingTool: [
          EventTrackingTool.ARCx,
          EventTrackingTool.Cookie3,
        ],
      });
    setWalletMenuState(!openWalletMenu);
  };

  const walletDigestButtonLabelData = useMemo(() => {
    const lastConnectedAccount = accounts.slice(-1)[0];
    return {
      addressDigest: walletDigest(lastConnectedAccount.address),
      chain: chains?.find(
        (chainEl: Chain) => chainEl.id === lastConnectedAccount.chainId,
      ),
      walletLogo: getConnectorIcon(lastConnectedAccount.connector),
    };
  }, [accounts, chains]);

  return (
    <>
      <div ref={walletManagementButtonsRef}>
        {!account.address ? (
          <ConnectButton
            // Used in the widget
            id="connect-wallet-button"
            onClick={handleWalletSelectClick}
          >
            {connectButtonLabel}
          </ConnectButton>
        ) : (
          <WalletMenuButton
            id="wallet-digest-button"
            onClick={handleWalletMenuClick}
          >
            {isSuccess && walletDigestButtonLabelData.chain ? (
              <WalletMgmtBadge
                overlap="circular"
                className="badge"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <WalletMgmtChainAvatar
                    // size="large"
                    src={walletDigestButtonLabelData.chain?.logoURI || ''}
                    alt={'wallet-avatar'}
                  >
                    {walletDigestButtonLabelData.chain?.name[0]}
                  </WalletMgmtChainAvatar>
                }
              >
                <WalletMgmtWalletAvatar
                  src={walletDigestButtonLabelData.walletLogo}
                />
              </WalletMgmtBadge>
            ) : null}
            <Typography
              variant={'lifiBodyMediumStrong'}
              width={'auto'}
              marginRight={0.25}
              marginLeft={0.75}
            >
              {walletDigestButtonLabelData.addressDigest}
            </Typography>
          </WalletMenuButton>
        )}
      </div>
      <WalletMenu anchorEl={walletManagementButtonsRef.current} />
      <WalletSelectMenu anchorEl={walletManagementButtonsRef.current} />
      <EcosystemSelectMenu anchorEl={walletManagementButtonsRef.current} />
    </>
  );
};
