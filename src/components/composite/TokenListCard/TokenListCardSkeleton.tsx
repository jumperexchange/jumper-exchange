import type { FC } from 'react';
import {
  EntityChainStackChainsPlacement,
  EntityChainStackVariant,
} from '../EntityChainStack/EntityChainStack.types';
import { EntityChainStack } from '../EntityChainStack/EntityChainStack';
import { TokenListCardTokenSize } from './TokenListCard.types';
import { TitleWithHintSkeleton } from '../TitleWithHint/TitleWithHintSkeleton';
import { TOKEN_LIST_CARD_CONFIG } from './constants';
import Stack from '@mui/material/Stack';

interface TokenListCardSkeletonProps {
  size?: TokenListCardTokenSize;
}

export const TokenListCardSkeleton: FC<TokenListCardSkeletonProps> = ({
  size = TokenListCardTokenSize.SM,
}) => {
  const config = TOKEN_LIST_CARD_CONFIG[size];

  return (
    <Stack
      direction="row"
      spacing={2}
      useFlexGap
      sx={[
        { justifyContent: 'space-between', width: '100%' },
        ...(Array.isArray(config.primary.itemSx)
          ? config.primary.itemSx
          : [config.primary.itemSx]),
      ]}
    >
      <EntityChainStack
        variant={EntityChainStackVariant.TokenWithChains}
        tokenSize={config.primary.tokenSize}
        chainsPlacement={EntityChainStackChainsPlacement.Inline}
        chainsSize={config.primary.chainsSize}
        spacing={{
          chains: config.chainsSpacing,
        }}
        isLoading
      />
      <TitleWithHintSkeleton />
    </Stack>
  );
};
