import { Chain } from '@lifi/types';
import { Avatar } from '@mui/material';
import { useMemo } from 'react';
import { useChainInfos } from '../../../providers/ChainInfosProvider';
import { useWallet } from '../../../providers/WalletProvider';
import { MenuListItem } from '../../../types';

const ConnectedSubMenuChains = () => {
  const { account, usedWallet, disconnect, switchChain } = useWallet();
  const { chains, isSuccess } = useChainInfos();
  const activeChain = useMemo(
    () => chains.find((chainEl: Chain) => chainEl.id === account.chainId),
    [chains.length, account.chainId],
  );

  const _ConnectedSubMenuChains: MenuListItem[] = [];

  chains.map((el) => {
    _ConnectedSubMenuChains.push({
      label: `${el.name}`,
      onClick: () => {
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
    });
  });

  return _ConnectedSubMenuChains;
};

export default ConnectedSubMenuChains;
