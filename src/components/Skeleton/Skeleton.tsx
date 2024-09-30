import { SkeletonWalletMenuButtonStyled } from './Skeleton.style';

export const SkeletonWalletMenuButton = ({
  variant,
}: {
  variant: 'circular' | 'rectangular';
}) => {
  return <SkeletonWalletMenuButtonStyled variant={variant} />;
};
