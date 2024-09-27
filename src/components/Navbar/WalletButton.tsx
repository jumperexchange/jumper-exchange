'use client';
import { useAccounts } from '@/hooks/useAccounts';
import { useChains } from '@/hooks/useChains';
import { useMenuStore } from '@/stores/menu';
import { walletDigest } from '@/utils/walletDigest';
import type { Chain } from '@lifi/sdk';
import { getConnectorIcon } from '@lifi/wallet-management';
import { Skeleton, Stack, Typography, alpha, useTheme } from '@mui/material';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ConnectButton,
  WalletMenuButton,
  WalletMgmtBadge,
  WalletMgmtChainAvatar,
  WalletMgmtWalletAvatar,
} from './WalletButton.style';
import { XPIcon } from '../illustrations/XPIcon';
import { useLoyaltyPass } from 'src/hooks/useLoyaltyPass';
import { JUMPER_LOYALTY_PATH } from 'src/const/urls';
import { useRouter } from 'next/navigation';
import useImageStatus from 'src/hooks/useImageStatus';

const DEFAULT_IMAGE = '/default_effigy.svg';

export const WalletButtons = () => {
  const { chains } = useChains();
  const { account } = useAccounts();
  const { t } = useTranslation();
  const { isSuccess } = useChains();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const theme = useTheme();
  const { points } = useLoyaltyPass();
  const router = useRouter();
  const imgLink = `https://effigy.im/a/${account?.address}.png`;
  const isImageValid = useImageStatus(imgLink);

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

  const handleXPClick = () => {
    router.push(JUMPER_LOYALTY_PATH);
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
        <Stack direction="row" spacing={2}>
          <WalletMenuButton id="wallet-digest-button" onClick={handleXPClick}>
            <Image
              src={isImageValid ? imgLink : DEFAULT_IMAGE}
              alt="Effigy Wallet Icon"
              width={28}
              height={28}
              priority={false}
              unoptimized={true}
              style={{
                borderRadius: '100%',
                borderStyle: 'solid',
                borderWidth: '2px',
                borderColor:
                  theme.palette.mode === 'light'
                    ? theme.palette.white.main
                    : alpha(theme.palette.white.main, 0.08),
              }}
            />
            {points === undefined ? (
              <Skeleton
                variant="text"
                sx={{
                  fontSize: { xs: 24, sm: 24 },
                  minWidth: 25,
                  marginRight: 1.1,
                  marginLeft: 1.1,
                }}
              />
            ) : (
              <Typography
                variant={'bodyMediumStrong'}
                width={'auto'}
                marginRight={1.1}
                marginLeft={1}
              >
                {points}
              </Typography>
            )}
            <XPIcon size={28} />
          </WalletMenuButton>
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
        </Stack>
      )}
    </>
  );
};
