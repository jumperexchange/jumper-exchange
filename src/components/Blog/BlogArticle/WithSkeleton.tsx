import type { FC } from 'react';

interface WithSkeletonProps {
  show: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
}

export const WithSkeleton: FC<WithSkeletonProps> = ({
  show,
  skeleton,
  children,
}) => (show ? <>{children}</> : <>{skeleton}</>);
