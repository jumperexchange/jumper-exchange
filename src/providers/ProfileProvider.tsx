'use client';
import { createContext, type PropsWithChildren } from 'react';

export const ProfileContext = createContext<ProfileProps>({
  walletAddress: '',
  isPublic: false,
});

interface ProfileProps {
  walletAddress: string;
  isPublic?: boolean;
}

export const ProfileProvider: React.FC<
  PropsWithChildren<Pick<ProfileProps, 'walletAddress' | 'isPublic'>>
> = ({ children, walletAddress, isPublic }) => {
  return (
    <ProfileContext.Provider
      value={{
        walletAddress,
        isPublic: isPublic ?? false,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
