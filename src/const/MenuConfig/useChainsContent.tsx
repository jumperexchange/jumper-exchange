import type { Chain } from '@lifi/types';
import { Avatar } from '@mui/material';
import { useMemo } from 'react';
import { useChains } from 'src/hooks';
import { useWallet } from 'src/providers';
import { useMenuStore } from 'src/stores';
import type { ChainsMenuListItem } from 'src/types';

export const useChainsContent = () => {
  const { account, switchChain } = useWallet();
  const { chains } = useChains();

  const onCloseAllNavbarMenus = useMenuStore(
    (state) => state.onCloseAllNavbarMenus,
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
