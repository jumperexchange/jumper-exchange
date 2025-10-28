import Stack from '@mui/material/Stack';
import {
  EntityChainStackChainsPlacement,
  EntityChainStackVariant,
} from '../EntityChainStack/EntityChainStack.types';
import { FC } from 'react';
import { PortfolioTokenSize } from './PortfolioToken';
import { AvatarSize } from 'src/components/core/AvatarStack/AvatarStack.types';
import { EntityChainStack } from '../EntityChainStack/EntityChainStack';
import { EntityChainTypographySkeleton } from '../EntityChainStack/EntityChainStack.styles';
import { EntityChainInfoContainer } from '../EntityChainStack/EntityChainStack.styles';

interface PortfolioTokenSkeletonProps {
  size?: PortfolioTokenSize;
}

export const PortfolioTokenSkeleton: FC<PortfolioTokenSkeletonProps> = ({
  size = PortfolioTokenSize.SM,
}) => {
  const isSmallVariant = size === PortfolioTokenSize.SM;
  const tokenSize = isSmallVariant ? AvatarSize.LG : AvatarSize.XXL;
  const chainsSize = isSmallVariant ? AvatarSize.XXS : AvatarSize.SM;
  const spacing = isSmallVariant ? 2 : 3;

  return (
    <Stack
      direction="row"
      spacing={2}
      useFlexGap
      justifyContent="space-between"
      sx={{ width: '100%', ':not(:last-child)': { paddingBottom: spacing } }}
    >
      <EntityChainStack
        variant={EntityChainStackVariant.TokensWithChains}
        tokenSize={tokenSize}
        chainsPlacement={EntityChainStackChainsPlacement.Inline}
        chainsSize={chainsSize}
        spacing={{
          chains: -0.8,
        }}
        isLoading
      />
      <EntityChainInfoContainer>
        <EntityChainTypographySkeleton variant="text" />
        <EntityChainTypographySkeleton variant="text" />
      </EntityChainInfoContainer>
    </Stack>
  );
};
