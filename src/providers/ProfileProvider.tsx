'use client'
import { createContext, type PropsWithChildren } from 'react';
import { isEVMAddress } from '@/utils/isEVMAddress';

export const ProfileContext = createContext<ProfileProps>({
  walletAddress: '',
  isEVMAddress: false,
  isPublic: false,
});

interface ProfileProps {
  walletAddress: string,
  isPublic?: boolean,
  isEVMAddress: boolean,
}

export const ProfileProvider: React.FC<
  PropsWithChildren<ProfileProps>
> = ({ children, walletAddress, isPublic }) => {
  return (
    <ProfileContext.Provider value={{ walletAddress, isPublic: isPublic ?? false, isEVMAddress: isEVMAddress(walletAddress) }}>
      {children}
    </ProfileContext.Provider>
  );
};
