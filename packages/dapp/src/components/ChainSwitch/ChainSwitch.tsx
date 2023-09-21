import type { Chain } from '@lifi/types';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import { Avatar } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { useChains, useUserTracking } from 'hooks';
import { useWallet } from 'providers';
import type { MouseEventHandler } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMenuStore } from 'stores';
import { EventTrackingTool } from 'types';
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
    () => chains.find((chainEl: Chain) => chainEl.id === account.chainId),
    [chains, account.chainId],
  );

  const handleOpenChainsMenu: MouseEventHandler<HTMLButtonElement> = (
    event,
  ) => {
    onOpenNavbarChainsMenu(!openNavbarChainsMenu, event.currentTarget);

    trackEvent({
      category: 'chain-menu',
      action: `click-open-chain-menu`,
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Raleon],
    });
  };

  return (
    <Tooltip title={t('navbar.walletMenu.switchChain')}>
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
