'use client';
import { createContext, useMemo, type PropsWithChildren } from 'react';

export const ProfileContext = createContext<ProfileProps>({
  walletAddress: '',
  isPublic: false,
  isLoading: true,
});

interface ProfileProps {
  walletAddress: string;
  isPublic?: boolean;
  isLoading?: boolean;
}

export const ProfileProvider: React.FC<
  PropsWithChildren<
    Pick<ProfileProps, 'walletAddress' | 'isPublic' | 'isLoading'>
  >
> = ({ children, walletAddress, isPublic, isLoading }) => {
  const value = useMemo(
    () => ({
      walletAddress,
      isPublic: isPublic ?? false,
      isLoading,
    }),
    [walletAddress, isPublic, isLoading],
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};
