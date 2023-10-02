import type { Chain } from '@lifi/types';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import { Avatar } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import type { MouseEventHandler } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const';
import { useChains, useUserTracking } from 'src/hooks';
import { useWallet } from 'src/providers';
import { useMenuStore } from 'src/stores';
import { EventTrackingTool } from 'src/types';
import { ButtonChainSwitch } from './';

export const ChainSwitch = () => {
  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();
  const { chains } = useChains();
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
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Raleon],
    });
  };

  return (
    <Tooltip title={t('navbar.walletMenu.switchChain')} arrow>
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
