import { FC, useMemo } from 'react';
import {
  ChainAvatar,
  ChainAvatarSize,
  ChainAvatarStack,
} from './ChainStack.style';
import { useChains } from 'src/hooks/useChains';

interface ChainStackProps {
  chainIds: string[];
  size?: ChainAvatarSize;
}

export const ChainStack: FC<ChainStackProps> = ({ chainIds, size }) => {
  const { getChainById } = useChains();
  const enhancedChains = useMemo(() => {
    return chainIds.map((chainId) => {
      const chain = getChainById(Number(chainId));
      return {
        id: chainId,
        logoURI: chain?.logoURI || '',
        name: chain?.name || '',
      };
    });
  }, [chainIds, getChainById]);

  return (
    <ChainAvatarStack direction="row" spacing={-1.25}>
      {enhancedChains.map((enhancedChain) => (
        <ChainAvatar
          size={size}
          key={enhancedChain.id}
          src={enhancedChain.logoURI}
          alt={enhancedChain.name}
        />
      ))}
    </ChainAvatarStack>
  );
};
