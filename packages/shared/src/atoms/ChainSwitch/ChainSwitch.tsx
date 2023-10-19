import type { Chain } from '@lifi/types';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import { Avatar } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@transferto/dapp/src/const';
import { usePopperIsOpened, useUserTracking } from '@transferto/dapp/src/hooks';
import { useChains } from '@transferto/dapp/src/hooks/useChains';
import { useWallet } from '@transferto/dapp/src/providers/WalletProvider';
import { useMenuStore } from '@transferto/dapp/src/stores';
import { EventTrackingTool } from '@transferto/dapp/src/types';
import type { MouseEventHandler } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonChainSwitch } from './ChainSwitch.style';

export const ChainSwitch = () => {
  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();
  const { chains } = useChains();
  const popperOpened = usePopperIsOpened();
  const { account } = useWallet();

  const [openNavbarChainsMenu, onOpenNavbarChainsMenu] = useMenuStore(
    (state) => [state.openNavbarChainsMenu, state.onOpenNavbarChainsMenu],
  );

  const activeChain = useMemo(
    () => chains?.find((chainEl: Chain) => chainEl.id === account.chainId),
    [chains, account.chainId],
  );

  const handleOpenChainsMenu: MouseEventHandler<HTMLButtonElement> = (
    event,
  ) => {
    onOpenNavbarChainsMenu(!openNavbarChainsMenu, event.currentTarget);
    trackEvent({
      category: TrackingCategory.ChainsMenu,
      action: TrackingAction.OpenMenu,
      label: 'click_open_chains_menu',
      data: { [TrackingEventParameter.Menu]: 'chains_menu' },
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Cookie3],
    });
  };

  return (
    <Tooltip
      title={t('navbar.walletMenu.switchChain')}
      disableHoverListener={popperOpened}
      arrow
    >
      <ButtonChainSwitch onClick={handleOpenChainsMenu}>
        {!!activeChain?.logoURI ? (
          <Avatar
            src={activeChain.logoURI || 'empty'}
            alt={`${activeChain.name}chain-logo`}
            sx={{ height: '32px', width: '32px' }}
          />
        ) : (
          <ChangeCircleOutlinedIcon sx={{ height: '32px', width: '32px' }} />
        )}
      </ButtonChainSwitch>
    </Tooltip>
  );
};
