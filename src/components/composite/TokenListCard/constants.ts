import { AvatarSize } from 'src/components/core/AvatarStack/AvatarStack.types';
import type { ResponsiveValue } from '@/types/responsive';
import { TokenListCardTokenSize } from './TokenListCard.types';
import type { TypographyProps } from '@mui/material/Typography';

interface TokenStackConfig {
  tokenSize: AvatarSize;
  chainsSize: AvatarSize;
  chainsInlineSize?: AvatarSize;
  titleVariant: TypographyProps['variant'];
  descriptionVariant: TypographyProps['variant'];
  padding: number;
  infoContainerGap: number;
}

interface TokenListCardConfig {
  primary: TokenStackConfig;
  expanded: TokenStackConfig;
  dividerSpacing: number;
  paddingBottom: number;
  chainsLimit: ResponsiveValue<number>;
  chainsSpacing: number;
}

const SM_CONFIG: TokenListCardConfig = {
  primary: {
    tokenSize: AvatarSize.LG,
    chainsSize: AvatarSize.XXS,
    chainsInlineSize: AvatarSize.XXS,
    titleVariant: 'bodySmallStrong',
    descriptionVariant: 'bodyXXSmall',
    padding: 1,
    infoContainerGap: 2,
  },
  expanded: {
    tokenSize: AvatarSize.LG,
    chainsSize: AvatarSize.XXS,
    titleVariant: 'bodySmallStrong',
    descriptionVariant: 'bodyXXSmall',
    padding: 1,
    infoContainerGap: 0,
  },
  dividerSpacing: 1,
  paddingBottom: 0.5,
  chainsLimit: 8,
  chainsSpacing: -0.8,
};

const MD_CONFIG: TokenListCardConfig = {
  primary: {
    tokenSize: AvatarSize.XXL,
    chainsSize: AvatarSize.SM,
    chainsInlineSize: AvatarSize.XS,
    titleVariant: 'titleXSmall',
    descriptionVariant: 'bodyXSmall',
    padding: 1.5,
    infoContainerGap: 2,
  },
  expanded: {
    tokenSize: AvatarSize.LG,
    chainsSize: AvatarSize.XXS,
    titleVariant: 'bodySmallStrong',
    descriptionVariant: 'bodyXXSmall',
    padding: 1.5,
    infoContainerGap: 0,
  },
  dividerSpacing: 1.5,
  paddingBottom: 1.5,
  chainsLimit: { mobile: 2, desktop: 8 },
  chainsSpacing: -0.8,
};

export const TOKEN_LIST_CARD_CONFIG: Record<
  TokenListCardTokenSize,
  TokenListCardConfig
> = {
  [TokenListCardTokenSize.SM]: SM_CONFIG,
  [TokenListCardTokenSize.MD]: MD_CONFIG,
};

export type { TokenStackConfig, TokenListCardConfig };
