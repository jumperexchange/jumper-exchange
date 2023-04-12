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

  if ((import.meta as any).env.VITE_LIFI_SHOW_TESTNET) {
    const testnetChains = chains.filter(
      (el) => !el.mainnet || el.id === account.chainId,
    );
    availableChains = testnetChains;
  }

  const _ConnectedSubMenuChains: MenuListItem[] = [];

  availableChains.forEach((el) => {
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
