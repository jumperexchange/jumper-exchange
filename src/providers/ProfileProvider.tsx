'use client';
import { createContext, useMemo, type PropsWithChildren } from 'react';

interface ProfileContextValue {
  walletAddress: string;
  isPublic: boolean;
  isLoading: boolean;
}

export const ProfileContext = createContext<ProfileContextValue>({
  walletAddress: '',
  isPublic: false,
  isLoading: true,
});

type ProfileProps = Pick<ProfileContextValue, 'walletAddress'> &
  Partial<Pick<ProfileContextValue, 'isPublic' | 'isLoading'>>;

export const ProfileProvider: React.FC<PropsWithChildren<ProfileProps>> = ({
  children,
  walletAddress,
  isPublic,
  isLoading,
}) => {
  const value = useMemo(
    () => ({
      walletAddress,
      isPublic: isPublic ?? false,
      isLoading: isLoading ?? false,
    }),
    [walletAddress, isPublic, isLoading],
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};
