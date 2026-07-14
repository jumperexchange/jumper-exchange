import {
  TrackingCategory,
  TrackingAction,
  TrackingEventParameter,
} from 'src/const/trackingKeys';
import { useUserTracking } from 'src/hooks/userTracking';
import WalletRoundedIcon from '@mui/icons-material/WalletRounded';
import { useMenuStore } from 'src/stores/menu';
import { useWalletDisplayData } from '../../hooks';
import useMediaQuery from '@mui/material/useMediaQuery';
import { LabelButton } from './LabelButton';
import { useTranslation } from 'react-i18next';
import { useAccount } from '@jumperexchange/wallet-management';
import { useMemo } from 'react';
import { useDominantColorFromImage } from '@/hooks/images/useGetColorsFromImage';
import { EntityStackWithBadge } from '@/components/composite/EntityStackWithBadge/EntityStackWithBadge';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import type { Protocol } from '@/types/jumper-backend';

export const WalletMenuToggle = () => {
  const { t } = useTranslation();
  const { accounts } = useAccount();
  const numberOfWallets = accounts.length;
  const { avatarSrc, activeChain, label: walletLabel } = useWalletDisplayData();
  const dominantColor = useDominantColorFromImage(avatarSrc ?? '', false, true);

  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('md'));

  const { openWalletMenu: _openWalletMenu, setWalletMenuState } = useMenuStore(
    (state) => state,
  );
  const { trackEvent } = useUserTracking();

  const icon = useMemo(() => {
    if (numberOfWallets > 1) {
      return <WalletRoundedIcon sx={{ fontSize: 28 }} />;
    }
    if (!avatarSrc) {
      return null;
    }
    const walletEntity: Protocol = { name: 'wallet', logo: avatarSrc };
    return (
      <EntityStackWithBadge
        entities={[walletEntity]}
        badgeEntities={activeChain ? [activeChain] : undefined}
        size={AvatarSize.MD}
        badgeSize={AvatarSize['3XS']}
        isContentVisible={false}
        entitiesSx={(theme) => ({
          backgroundColor:
            dominantColor ?? (theme.vars || theme).palette.black.main,
          ...theme.applyStyles('light', {
            backgroundColor:
              dominantColor ?? (theme.vars || theme).palette.alphaDark900.main,
          }),
        })}
      />
    );
  }, [avatarSrc, activeChain, numberOfWallets, dominantColor]);

  const label = useMemo(() => {
    if (numberOfWallets > 1) {
      return t('navbar.wallets');
    }
    return t('navbar.wallet');
  }, [numberOfWallets, t]);

  const caption = useMemo(() => {
    if (numberOfWallets > 1) {
      return undefined;
    }
    return walletLabel;
  }, [numberOfWallets, walletLabel]);

  const handleWalletMenuClick = () => {
    setWalletMenuState(!_openWalletMenu);
    if (!_openWalletMenu) {
      trackEvent({
        category: TrackingCategory.WalletMenu,
        action: TrackingAction.OpenMenu,
        label: 'open_portfolio_menu',
        data: {
          [TrackingEventParameter.Menu]: 'portfolio',
          [TrackingEventParameter.Timestamp]: new Date().toUTCString(),
        },
      });
    }
  };

  return (
    <LabelButton
      icon={icon}
      label={label}
      caption={caption}
      isLabelVisible={isDesktop}
      onClick={handleWalletMenuClick}
      id="wallet-digest-button"
    />
  );
};
