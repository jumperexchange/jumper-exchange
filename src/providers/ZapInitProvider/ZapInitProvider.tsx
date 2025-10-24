'use client';

import { ChainId, ChainType, EVMProvider, Route } from '@lifi/sdk';
import { useAccount } from '@lifi/wallet-management';
import { MultichainSmartAccount } from '@biconomy/abstractjs';
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useEnhancedZapData } from 'src/hooks/zaps/useEnhancedZapData';
import { useZapSupportedChains } from 'src/hooks/zaps/useZapSupportedChains';
import { useZapPendingOperationsStore } from 'src/stores/zapPendingOperations/ZapPendingOperationsStore';
import { ProjectData } from 'src/types/questDetails';
import { Hex } from 'viem';
import { useConfig, UseReadContractsReturnType, useSwitchChain } from 'wagmi';
import { useZapQuestIdStorage } from '../hooks';
interface ZapInitState {
  isEvmWallet: boolean;
  isConnected: boolean;
  toAddress?: Hex;
  zapData?: any;
  isZapDataSuccess: boolean;
  setCurrentRoute: (newRoute: Route) => void;
  depositTokenData: number | bigint | undefined;
  depositTokenDecimals: number | bigint | undefined;
  isLoadingDepositTokenData: boolean;
  refetchDepositToken: UseReadContractsReturnType['refetch'];
  projectData: ProjectData;
}

export const ZapInitContext = createContext<ZapInitState>({
  isEvmWallet: false,
  isConnected: false,
  toAddress: undefined,
  zapData: undefined,
  isZapDataSuccess: false,
  setCurrentRoute: () => {},
  depositTokenData: undefined,
  depositTokenDecimals: undefined,
  isLoadingDepositTokenData: false,
  refetchDepositToken: () =>
    Promise.resolve({}) as ReturnType<UseReadContractsReturnType['refetch']>,
  projectData: {} as ProjectData,
});

export const useZapInitContext = () => {
  const zapInitContext = useContext(ZapInitContext);

  if (!zapInitContext) {
    throw new Error(
      'This hook must be used within the "ZapInitContext" provider',
    );
  }

  return zapInitContext;
};

interface ZapInitProviderProps extends PropsWithChildren {
  projectData: ProjectData;
}

export const ZapInitProvider: FC<ZapInitProviderProps> = ({
  children,
  projectData,
}) => {
  useZapQuestIdStorage();
  const wagmiConfig = useConfig();

  const { data: zapSupportedChains } = useZapSupportedChains();

  // @Note: Might need to handle the persisted pending operations a bit differently
  // but it depends on the route execution logic which currently handles a single active route at a time
  const { setCurrentRoute } = useZapPendingOperationsStore();

  const {
    zapData,
    isSuccess: isZapDataSuccess,
    depositTokenData,
    depositTokenDecimals,
    isLoadingDepositTokenData,
    refetchDepositToken,
  } = useEnhancedZapData(projectData);

  const { account } = useAccount();
  const { address, chainType } = account;
  const isEvmWallet = chainType === ChainType.EVM;

  const isConnected = account.isConnected && !!address;

  const value = useMemo(() => {
    return {
      isEvmWallet,
      isConnected,
      zapData,
      isZapDataSuccess,
      setCurrentRoute,
      depositTokenData,
      depositTokenDecimals,
      isLoadingDepositTokenData,
      refetchDepositToken,
      projectData,
    };
  }, [
    isEvmWallet,
    isConnected,
    zapData,
    isZapDataSuccess,
    depositTokenData,
    depositTokenDecimals,
    isLoadingDepositTokenData,
    refetchDepositToken,
    setCurrentRoute,
    projectData,
  ]);

  return (
    <ZapInitContext.Provider value={value}>{children}</ZapInitContext.Provider>
  );
};
