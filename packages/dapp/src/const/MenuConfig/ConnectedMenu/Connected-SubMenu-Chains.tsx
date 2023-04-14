import { Chain } from '@lifi/types';
import { Avatar } from '@mui/material';
import { useMemo } from 'react';
import { shallow } from 'zustand/shallow';
import { useChainInfos } from '../../../providers/ChainInfosProvider';
import { useWallet } from '../../../providers/WalletProvider';
import { useMenuStore } from '../../../stores';
import { MenuListItem } from '../../../types';

const ConnectedSubMenuChains = () => {
  const { account, switchChain } = useWallet();
  const { chains } = useChainInfos();
  const activeChain = useMemo(
    () => chains.find((chainEl: Chain) => chainEl.id === account.chainId),
    [chains, account.chainId],
  );

  const [onCloseAllNavbarMenus] = useMenuStore(
    (state) => [state.onCloseAllNavbarMenus],
    shallow,
  );

  const _ConnectedSubMenuChains: MenuListItem[] = chains.map((el) => ({
    label: `${el.name}`,
    onClick: () => {
      switchChain(el.id);
      onCloseAllNavbarMenus();
    },
    prefixIcon: (
      <Avatar
        src={el.logoURI}
        alt={`${el.name}-chain-logo`}
        sx={{ height: '32px', width: '32px' }}
      />
    ),
    checkIcon: el.id === activeChain?.id,
  }));

  return _ConnectedSubMenuChains;
};

export default ConnectedSubMenuChains;
