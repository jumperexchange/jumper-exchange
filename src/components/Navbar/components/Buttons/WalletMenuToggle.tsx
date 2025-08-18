import {
  TrackingCategory,
  TrackingAction,
  TrackingEventParameter,
} from 'src/const/trackingKeys';
import { useUserTracking } from 'src/hooks/userTracking';
import { useMenuStore } from 'src/stores/menu';
import { useWalletDisplayData } from '../../hooks';
import useMediaQuery from '@mui/material/useMediaQuery';
import { NavbarButtonLabel } from './Buttons.style';
import AvatarBadge from 'src/components/AvatarBadge/AvatarBadge';
import { LabelButton } from './LabelButton';

export const WalletMenuToggle = () => {
  const { avatarSrc, badgeSrc, label: walletLabel } = useWalletDisplayData();

  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('md'));

  const { openWalletMenu: _openWalletMenu, setWalletMenuState } = useMenuStore(
    (state) => state,
  );
  const { trackEvent } = useUserTracking();

  const handleWalletMenuClick = () => {
    setWalletMenuState(!_openWalletMenu);
    if (!_openWalletMenu) {
      // Only track the event if the menu is not already open
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
      icon={
        avatarSrc &&
        badgeSrc && (
          <AvatarBadge
            avatarSrc={avatarSrc}
            badgeSrc={badgeSrc}
            avatarSize={32}
            // We need to account for the border
            badgeSize={14}
            badgeGap={4}
            badgeOffset={{ x: 2.5, y: 2.5 }}
            alt={'wallet-avatar'}
            badgeAlt={'chain-avatar'}
            maskEnabled={false}
            sxAvatar={(theme) => ({
              padding: theme.spacing(0.5),
            })}
            sxBadge={(theme) => ({
              border: '2px solid',
              borderColor: (theme.vars || theme).palette.surface1.main,
              background: 'transparent',
              ...theme.applyStyles('light', {
                backgroundColor: (theme.vars || theme).palette.alphaDark900
                  .main,
              }),
            })}
            sx={(theme) => ({
              border: '2px solid',
              borderColor: (theme.vars || theme).palette.surface1.main,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              // Use backgroundImage to repeat non-SVG icons in the padding ring; fallback to backgroundColor for SVGs
              backgroundImage:
                avatarSrc && !avatarSrc.includes('svg')
                  ? `url(${avatarSrc})`
                  : 'none',
              backgroundColor: (theme.vars || theme).palette.black.main,
              ...theme.applyStyles('light', {
                backgroundColor: (theme.vars || theme).palette.alphaDark900
                  .main,
              }),
            })}
          />
        )
      }
      label={walletLabel}
      isLabelVisible={isDesktop}
      onClick={handleWalletMenuClick}
      id="wallet-digest-button"
    />
  );
};
