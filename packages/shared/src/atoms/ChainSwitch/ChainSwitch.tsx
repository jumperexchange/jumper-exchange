import type { Chain } from '@lifi/types';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import { Avatar } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { useUserTracking } from '@transferto/dapp/src/hooks';
import { useChains } from '@transferto/dapp/src/hooks/useChains';
import { useWallet } from '@transferto/dapp/src/providers/WalletProvider';
import { useMenuStore } from '@transferto/dapp/src/stores';
import { EventTrackingTool } from '@transferto/dapp/src/types';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';
import { ButtonChainSwitch } from './ChainSwitch.style';

export const ChainSwitch = () => {
  const { t: translate } = useTranslation();
  const i18Path = 'navbar.walletMenu.';
  const { trackEvent } = useUserTracking();
  const { chains } = useChains();
  const { account } = useWallet();

  const [openNavbarChainsMenu, onOpenNavbarChainsMenu] = useMenuStore(
    (state) => [state.openNavbarChainsMenu, state.onOpenNavbarChainsMenu],
    shallow,
  );

  const activeChain = useMemo(
    () => chains.find((chainEl: Chain) => chainEl.id === account.chainId),
    [chains, account.chainId],
  );

  const handleOpenChainsMenu = (event) => {
    onOpenNavbarChainsMenu(!openNavbarChainsMenu, event.currentTarget);

    trackEvent({
      category: 'chain-menu',
      action: `click-open-chain-menu`,
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Raleon],
    });
  };

  return (
    <Tooltip title={translate(`${i18Path}switchChain`)}>
      <ButtonChainSwitch
        onClick={(event) => {
          handleOpenChainsMenu(event);
        }}
      >
        {!!activeChain?.logoURI ? (
          <Avatar
            src={activeChain?.logoURI || 'empty'}
            alt={`${activeChain?.name}chain-logo`}
            sx={{ height: '32px', width: '32px' }}
          />
        ) : (
          <ChangeCircleOutlinedIcon sx={{ height: '32px', width: '32px' }} />
        )}
      </ButtonChainSwitch>
    </Tooltip>
  );
};
