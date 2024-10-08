'use client';
import {
  AvatarBase,
  AvatarSkeletonBase,
  AvatarSkeletonContainer,
} from './Avatar.style';

export const AvatarSkeleton = ({ size }: { size: number }) => {
  return (
    <AvatarSkeletonContainer size={size}>
      <AvatarSkeletonBase size={size} variant="circular" />
    </AvatarSkeletonContainer>
  );
};

type AvatarProps = {
  size: number;
  src: string;
  alt: string;
  children?: React.ReactNode;
};

export const Avatar: React.FC<AvatarProps> = ({ size, src, alt }) => {
  return <AvatarBase src={src} alt={alt} className="avatar" size={size} />;
};
