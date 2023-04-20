import { Chain } from '@lifi/types';
import { Avatar } from '@mui/material';
import { useMemo } from 'react';
import { shallow } from 'zustand/shallow';
import { useChainInfos } from '../providers/ChainInfosProvider';
import { useWallet } from '../providers/WalletProvider';
import { useMenuStore } from '../stores';
import { ChainsMenuListItem } from '../types';

export const useGetChains = () => {
  const { account, switchChain } = useWallet();
  const { chains } = useChainInfos();

  const [onCloseAllNavbarMenus] = useMenuStore(
    (state) => [state.onCloseAllNavbarMenus],
    shallow,
  );

  const activeChain = useMemo(
    () => chains.find((chainEl: Chain) => chainEl.id === account.chainId),
    [chains, account.chainId],
  );

  return chains.map(
    (el): ChainsMenuListItem => ({
      label: `${el.name}`,
      onClick: () => {
        onCloseAllNavbarMenus();
        switchChain(el.id);
      },
      prefixIcon: (
        <Avatar
          src={el.logoURI}
          alt={`${el.name}-chain-logo`}
          sx={{ height: '32px', width: '32px' }}
        />
      ),
      checkIcon: el.id === activeChain?.id,
      chainId: el.id,
    }),
  );
};
