import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';

export const REWARD_CLAIM_CARD_CONFIG = {
  tokenSize: AvatarSize.LG,
  chainsSize: AvatarSize.XS,
  titleVariant: 'bodySmallStrong',
  descriptionVariant: 'bodyXSmall',
  infoContainerGap: 0,
  itemSx: {
    borderRadius: 0,
    alignSelf: 'stretch',
    '&:not(:has([data-hint-hover-active]))': {
      '&:hover, &:focus-visible, &:focus': {
        backgroundColor: 'transparent',
      },
    },
  },
} as const;

export const CLAIMABLE_MIN_AMOUNT_USD = 0.1;
