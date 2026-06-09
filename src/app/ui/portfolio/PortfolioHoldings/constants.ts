import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';

export const defaultConfig = {
  titleVariant: 'bodyLargeStrong',
  descriptionVariant: 'bodyXSmall',
  tokenSize: AvatarSize.XXL,
  chainsSize: AvatarSize.SM,
  inlineChainsSize: AvatarSize.XS,
  chainsLimit: 8,
  chainsSpacing: -0.5,
  infoContainerGap: 0.5,
} as const;
