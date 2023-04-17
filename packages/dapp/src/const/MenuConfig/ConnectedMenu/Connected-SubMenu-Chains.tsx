import { Chain } from '@lifi/types';
import { Avatar } from '@mui/material';
import { useMemo } from 'react';
import { useChainInfos } from '../../../providers/ChainInfosProvider';
import { useWallet } from '../../../providers/WalletProvider';
import { MenuListItem } from '../../../types';

const ConnectedSubMenuChains = () => {
  const { account, switchChain } = useWallet();
  const { chains } = useChainInfos();
  const activeChain = useMemo(
    () => chains.find((chainEl: Chain) => chainEl.id === account.chainId),
    [chains, account.chainId],
  );

  let availableChains = chains;

  if ((import.meta as ImportMeta).env.MODE === 'testnet') {
    const testnetChains = chains.filter(
      (el) => !el.mainnet || el.id === account.chainId,
    );
    availableChains = testnetChains;
  }

  const connectedSubMenuChains: MenuListItem[] = availableChains.map((el) => ({
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
  }));

  return connectedSubMenuChains;
};

export default ConnectedSubMenuChains;
