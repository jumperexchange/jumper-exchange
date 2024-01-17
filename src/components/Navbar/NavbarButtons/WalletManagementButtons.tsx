import type { Chain } from '@lifi/types';
import type { Breakpoint } from '@mui/material';
import { Typography, useTheme } from '@mui/material';
import type { ReactElement } from 'react';
import React, { useMemo, useRef } from 'react';
import {
  Button,
  WalletMenu,
  WalletMgmtAvatarContainer,
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
  const theme = useTheme();
  const { chains } = useChains();
  const { trackEvent } = useUserTracking();
  const { account } = useAccounts();
  const connectButtonRef = useRef<any>();
  const digestButtonRef = useRef<any>();

  const {
    openWalletSelectMenu,
    setWalletSelectMenuState,
    openWalletMenu,
    setWalletMenuState,
  } = useMenuStore((state) => state);

  const _walletDigest = useMemo(() => {
    return walletDigest(account.address);
  }, [account]);
  const activeChain = useMemo(
    () => chains?.find((chainEl: Chain) => chainEl.id === account.chainId),
    [chains, account.chainId],
  );

  const walletIcon: string = useMemo(() => {
    if (account.isConnected) {
      return account.connector?.icon ?? '';
    } else {
      return '';
    }
  }, [account]);

  const handleWalletSelectClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
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

  const handleWalletMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
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

  return !account.address ? (
    // Connect/WalletSelect-Button -->
    <>
      <div ref={connectButtonRef}>
        <Button
          // Used in the widget
          variant="primary"
          id="connect-wallet-button"
          onClick={handleWalletSelectClick}
          styles={{
            display: 'none',
            [theme.breakpoints.up('sm' as Breakpoint)]: {
              padding: theme.spacing(3),
              display: 'inline-flex !important',
            },
          }}
        >
          {connectButtonLabel}
        </Button>
      </div>
      <WalletSelectMenu anchorEl={connectButtonRef.current} />
      <EcosystemSelectMenu anchorEl={connectButtonRef.current} />
    </>
  ) : (
    // Wallet-Menu-Button -->
    <div ref={digestButtonRef}>
      <Button
        variant="secondary"
        id="wallet-digest-button"
        styles={{
          display: 'flex',
          placeContent: 'space-between',
          justifyContent: 'center',
          margin: 'auto',
          position: 'relative',
          p: '6px',
          pr: theme.spacing(2),
          width: 'auto',
        }}
        onClick={handleWalletMenuClick}
      >
        {isSuccess && activeChain ? (
          <WalletMgmtAvatarContainer>
            <WalletMgmtWalletAvatar src={walletIcon} />
            <WalletMgmtChainAvatar
              src={activeChain.logoURI || 'empty'}
              alt={`${activeChain.name}chain-logo`}
            />
          </WalletMgmtAvatarContainer>
        ) : null}
        <Typography variant={'lifiBodyMediumStrong'} width={'auto'}>
          {_walletDigest}
        </Typography>
      </Button>
      <WalletMenu anchorEl={digestButtonRef.current} />
    </div>
  );
};
