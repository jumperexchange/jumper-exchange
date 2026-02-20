import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import type { BalanceCardConfig } from './types';
import { BalanceCardSize } from './types';

const SM_CONFIG: BalanceCardConfig = {
  primary: {
    tokenSize: AvatarSize.LG,
    chainsSize: AvatarSize.XXS,
    inlineChainsSize: AvatarSize.XXS,
    titleVariant: 'bodySmallStrong',
    descriptionVariant: 'bodyXXSmall',
    infoContainerGap: 2,
    itemSx: {
      padding: 1,
    },
  },
  expanded: {
    tokenSize: AvatarSize.MD,
    chainsSize: AvatarSize.XXS,
    titleVariant: 'bodySmallStrong',
    descriptionVariant: 'bodyXXSmall',
    infoContainerGap: 0,
    itemSx: (theme) => ({
      padding: theme.spacing(1, 1, 1, 2),
    }),
  },
  dividerSpacing: 1,
  paddingBottom: 0.5,
  chainsLimit: 8,
  chainsSpacing: -0.5,
};

const MD_CONFIG: BalanceCardConfig = {
  primary: {
    tokenSize: AvatarSize.XXL,
    chainsSize: AvatarSize.SM,
    inlineChainsSize: AvatarSize.XS,
    titleVariant: 'titleXSmall',
    descriptionVariant: 'bodyXSmall',
    infoContainerGap: 2,
    itemSx: {
      padding: 1.5,
    },
  },
  expanded: {
    tokenSize: AvatarSize.LG,
    chainsSize: AvatarSize.XXS,
    titleVariant: 'bodySmallStrong',
    descriptionVariant: 'bodyXXSmall',
    infoContainerGap: 0,
    itemSx: {
      padding: 1.5,
    },
  },
  dividerSpacing: 1.5,
  paddingBottom: 1.5,
  chainsLimit: { mobile: 2, desktop: 8 },
  chainsSpacing: -0.5,
};

export const BALANCE_CARD_CONFIG: Record<BalanceCardSize, BalanceCardConfig> = {
  [BalanceCardSize.SM]: SM_CONFIG,
  [BalanceCardSize.MD]: MD_CONFIG,
};
