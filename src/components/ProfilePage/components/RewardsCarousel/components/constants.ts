import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';

export const REWARD_CLAIM_CARD_CONFIG = {
  tokenSize: AvatarSize.LG,
  chainsSize: AvatarSize.XS,
  titleVariant: 'bodySmallStrong',
  descriptionVariant: 'bodyXSmall',
  infoContainerGap: 0,
  itemSx: {
    '&:not(:has([data-hint-hover-active]))': {
      '&:hover, &:focus-visible, &:focus': {
        backgroundColor: 'transparent',
      },
    },
  },
} as const;
