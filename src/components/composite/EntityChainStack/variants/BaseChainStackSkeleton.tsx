import { FC } from 'react';
import { EntityChainContainer } from '../EntityChainStack.styles';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { AvatarSkeleton } from 'src/components/core/AvatarStack/AvatarStack.styles';
import { TitleWithHintSkeleton } from '../../TitleWithHint/TitleWithHintSkeleton';

interface BaseChainStackSkeletonProps {
  size?: AvatarSize;
  isContentVisible?: boolean;
}

export const BaseChainStackSkeleton: FC<BaseChainStackSkeletonProps> = ({
  size,
  isContentVisible = true,
}) => {
  return (
    <EntityChainContainer sx={{ gap: 1 }}>
      <AvatarSkeleton size={size} variant="circular" />
      {isContentVisible && <TitleWithHintSkeleton />}
    </EntityChainContainer>
  );
};
