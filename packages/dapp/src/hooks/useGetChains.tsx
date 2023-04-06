import { Chain } from '@lifi/types';
import { Avatar } from '@mui/material';
import { useMemo } from 'react';
import { useChainInfos } from '../providers/ChainInfosProvider';
import { useWallet } from '../providers/WalletProvider';
import { ChainsMenuListItem } from '../types';

export const useGetChains = () => {
  const { account, switchChain } = useWallet();
  const { chains } = useChainInfos();
  const activeChain = useMemo(
    () => chains.find((chainEl: Chain) => chainEl.id === account.chainId),
    [chains, account.chainId],
  );

  return chains.map(
    (el): ChainsMenuListItem => ({
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
      chainId: el.id,
    }),
  );
};
