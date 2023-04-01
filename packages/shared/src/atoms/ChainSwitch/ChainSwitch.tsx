import type { Chain } from '@lifi/types';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import { Avatar } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  EventTrackingTools,
  useUserTracking,
} from '../../../../dapp/src/hooks';
import { useChainInfos } from '../../../../dapp/src/providers/ChainInfosProvider';
import { useMenu } from '../../../../dapp/src/providers/MenuProvider';
import { useWallet } from '../../../../dapp/src/providers/WalletProvider';
import { useSettings } from '../../hooks';
import { ButtonChainSwitch } from './ChainSwitch.style';

export const ChainSwitch = () => {
  const settings = useSettings();
  const { t: translate } = useTranslation();
  const i18Path = 'navbar.';
  const { trackEvent } = useUserTracking();
  const menu = useMenu();
  const { chains, isSuccess } = useChainInfos();
  const { account } = useWallet();
  const activeChain = useMemo(
    () => chains.find((chainEl: Chain) => chainEl.id === account.chainId),
    [chains, account.chainId],
  );

  const handleOpenChainsMenu = () => {
    menu.onOpenNavbarChainsMenu(true);

    trackEvent({
      category: 'chain-menu',
      action: `click-open-chain-menu`,
      disableTrackingTool: [EventTrackingTools.arcx],
    });
  };

  return (
    <Tooltip title={activeChain.name}>
      <ButtonChainSwitch
        onClick={() => {
          handleOpenChainsMenu();
        }}
      >
        {!!activeChain?.logoURI ? (
          <Avatar
            src={!!activeChain ? activeChain.logoURI : 'empty'}
            alt={`${!!activeChain?.name ? activeChain.name : ''}chain-logo`}
            sx={{ height: '32px', width: '32px' }}
          />
        ) : (
          <ChangeCircleOutlinedIcon sx={{ height: '32px', width: '32px' }} />
        )}
      </ButtonChainSwitch>
    </Tooltip>
  );
};
