'use client';
import { useChains } from '@/hooks/useChains';
import { useMenuStore } from '@/stores/menu';
import { walletDigest } from '@/utils/walletDigest';
import type { Chain } from '@lifi/sdk';
import {
  getConnectorIcon,
  useAccount,
  useWalletMenu,
} from '@lifi/wallet-management';
import { Typography } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import AvatarBadge from '../AvatarBadge/AvatarBadge';
import { ConnectButton, WalletMenuButton } from './WalletButton.style';

export const WalletButtons = () => {
  const { chains } = useChains();
  const { account } = useAccount();
  const { t } = useTranslation();
  const { isSuccess } = useChains();
  const { openWalletMenu } = useWalletMenu();

  const { openWalletMenu: _openWalletMenu, setWalletMenuState } = useMenuStore(
    (state) => state,
  );

  const _walletDigest = useMemo(() => {
    return walletDigest(account?.address);
  }, [account?.address]);

  const activeChain = useMemo(
    () => chains?.find((chainEl: Chain) => chainEl.id === account?.chainId),
    [chains, account?.chainId],
  );

  const handleWalletMenuClick = () => {
    setWalletMenuState(!_openWalletMenu);
  };

  return (
    <>
      {!account?.address ? (
        <ConnectButton
          // Used in the widget
          id="connect-wallet-button"
          onClick={(event) => {
            event.stopPropagation();
            openWalletMenu();
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
            {t('navbar.connect')}
          </Typography>
        </ConnectButton>
      ) : (
        <WalletMenuButton
          id="wallet-digest-button"
          onClick={handleWalletMenuClick}
        >
          {isSuccess && activeChain ? (
            <AvatarBadge
              avatarAlt="Wallet avatar"
              avatarSize={32}
              avatarSrc={getConnectorIcon(account.connector)}
              badgeAlt={`${activeChain?.name} avatar`}
              badgeSize={12}
              badgeSrc={activeChain?.logoURI || ''}
              badgeOffset={{ x: 4, y: 4 }}
              badgeGap={5}
            />
          ) : null}
          <Typography
            variant={'bodyMediumStrong'}
            width={'auto'}
            marginRight={0.25}
            marginLeft={0.75}
          >
            {_walletDigest}
          </Typography>
        </WalletMenuButton>
      )}
    </>
  );
};
