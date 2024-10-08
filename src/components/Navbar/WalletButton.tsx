'use client';
import { useAccounts } from '@/hooks/useAccounts';
import { useChains } from '@/hooks/useChains';
import { useMenuStore } from '@/stores/menu';
import { walletDigest } from '@/utils/walletDigest';
import type { Chain } from '@lifi/types';
import { getConnectorIcon } from '@lifi/wallet-management';
import { Typography } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import AvatarBadge from '../AvatarBadge/AvatarBadge';
import { ConnectButton, WalletMenuButton } from './WalletButton.style';

export const WalletButtons = () => {
  const { chains } = useChains();
  const { account } = useAccounts();
  const { t } = useTranslation();
  const { isSuccess } = useChains();

  const {
    openWalletSelectMenu,
    setWalletSelectMenuState,
    openWalletMenu,
    setWalletMenuState,
  } = useMenuStore((state) => state);

  const _walletDigest = useMemo(() => {
    return walletDigest(account?.address);
  }, [account?.address]);

  const activeChain = useMemo(
    () => chains?.find((chainEl: Chain) => chainEl.id === account?.chainId),
    [chains, account?.chainId],
  );

  const handleWalletSelectClick = () => {
    setWalletSelectMenuState(!openWalletSelectMenu);
  };

  const handleWalletMenuClick = () => {
    setWalletMenuState(!openWalletMenu);
  };

  return (
    <>
      {!account?.address ? (
        <ConnectButton
          // Used in the widget
          id="connect-wallet-button"
          onClick={(event) => {
            event.stopPropagation();
            handleWalletSelectClick();
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
              avatarSrc={getConnectorIcon(account.connector)}
              badgeSrc={activeChain?.logoURI || ''}
              avatarSize={32}
              badgeSize={12}
              alt="Wallet avatar"
              badgeOffset={{ x: 4, y: 4 }}
              badgeGap={5}
              badgeAlt={`${activeChain?.name} avatar`}
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
