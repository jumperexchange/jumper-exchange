'use client';
import { useChains } from '@/hooks/useChains';
import { useMenuStore } from '@/stores/menu';
import { walletDigest } from '@/utils/walletDigest';
import type { Chain } from '@lifi/types';
import {
  getConnectorIcon,
  useAccount,
  useWalletMenu,
} from '@lifi/wallet-management';
import { Typography } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ConnectButton,
  WalletMenuButton,
  WalletMgmtBadge,
  WalletMgmtChainAvatar,
  WalletMgmtWalletAvatar,
} from './WalletButton.style';

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
            <WalletMgmtBadge
              overlap="circular"
              className="badge"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <WalletMgmtChainAvatar
                  src={activeChain?.logoURI || ''}
                  alt={'wallet-avatar'}
                >
                  {activeChain.name[0]}
                </WalletMgmtChainAvatar>
              }
            >
              <WalletMgmtWalletAvatar
                src={getConnectorIcon(account.connector)}
              />
            </WalletMgmtBadge>
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
