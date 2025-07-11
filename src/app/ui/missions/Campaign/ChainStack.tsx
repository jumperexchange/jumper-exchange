import { FC, useMemo } from 'react';
import { ChainAvatar, ChainAvatarStack } from './BannerCarousel.style';
import { useChains } from 'src/hooks/useChains';

interface ChainStackProps {
  chainIds: string[];
}

export const ChainStack: FC<ChainStackProps> = ({ chainIds }) => {
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
          key={enhancedChain.id}
          src={enhancedChain.logoURI}
          alt={enhancedChain.name}
        />
      ))}
    </ChainAvatarStack>
  );
};
