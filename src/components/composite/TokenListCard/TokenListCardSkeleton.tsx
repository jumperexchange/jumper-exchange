import Stack from '@mui/material/Stack';
import {
  EntityChainStackChainsPlacement,
  EntityChainStackVariant,
} from '../EntityChainStack/EntityChainStack.types';
import { FC } from 'react';
import { AvatarSize } from 'src/components/core/AvatarStack/AvatarStack.types';
import { EntityChainStack } from '../EntityChainStack/EntityChainStack';
import { TokenListCardTokenSize } from './TokenListCard.types';
import { TitleWithHintSkeleton } from '../TitleWithHint/TitleWithHintSkeleton';

interface TokenListCardSkeletonProps {
  size?: TokenListCardTokenSize;
}

export const TokenListCardSkeleton: FC<TokenListCardSkeletonProps> = ({
  size = TokenListCardTokenSize.SM,
}) => {
  const isSmallVariant = size === TokenListCardTokenSize.SM;
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
        variant={EntityChainStackVariant.TokenWithChains}
        tokenSize={tokenSize}
        chainsPlacement={EntityChainStackChainsPlacement.Inline}
        chainsSize={chainsSize}
        spacing={{
          chains: -0.8,
        }}
        isLoading
      />

      <TitleWithHintSkeleton />
    </Stack>
  );
};
