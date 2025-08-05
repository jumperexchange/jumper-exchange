'use client';

import { EVMProvider, Route } from '@lifi/sdk';
import { useAccount } from '@lifi/wallet-management';
import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  useCallback,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useEnhancedZapData } from 'src/hooks/zaps/useEnhancedZapData';
import { createCustomEVMProvider } from 'src/providers/WalletProvider/createCustomEVMProvider';
import { EVMAddress } from 'src/types/internal';
import { ProjectData } from 'src/types/questDetails';
import { useConfig, UseReadContractsReturnType, useWalletClient } from 'wagmi';
import {
  WalletMethods,
  WalletMethodsRef,
  WalletMethodArgsType,
  WalletMethodReturnType,
} from './types';
import { useBiconomyClientsStore } from 'src/stores/biconomyClients/BiconomyClientsStore';
import { useZapPendingOperationsStore } from 'src/stores/zapPendingOperations/ZapPendingOperationsStore';
import {
  getCapabilities,
  getCallsStatus,
  sendCalls,
  waitForCallsStatus,
} from './WalletClient/methods';

interface ZapInitState {
  isInitialized: boolean;
  isInitializedForCurrentChain: boolean;
  isConnected: boolean;
  providers: EVMProvider[];
  toAddress?: EVMAddress;
  zapData?: any;
  isZapDataSuccess: boolean;
  setCurrentRoute: (newRoute: Route) => void;
  depositTokenData: number | bigint | undefined;
  depositTokenDecimals: number | bigint | undefined;
  isLoadingDepositTokenData: boolean;
  refetchDepositToken: UseReadContractsReturnType['refetch'];
}

export const ZapInitContext = createContext<ZapInitState>({
  isInitialized: false,
  isInitializedForCurrentChain: false,
  isConnected: false,
  providers: [],
  toAddress: undefined,
  zapData: undefined,
  isZapDataSuccess: false,
  setCurrentRoute: () => {},
  depositTokenData: undefined,
  depositTokenDecimals: undefined,
  isLoadingDepositTokenData: false,
  refetchDepositToken: () =>
    Promise.resolve({}) as ReturnType<UseReadContractsReturnType['refetch']>,
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
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
  // @Note: Might need to handle the persisted pending operations a bit differently
  // but it depends on the route execution logic which currently handles a single active route at a time
  const {
    pendingOperations,
    addPendingOperation,
    removePendingOperation,
    getPromiseResolversForOperation,
  } = useZapPendingOperationsStore();

  const { hasProjectClients, hasWalletClients, getClients, getToAddress } =
    useBiconomyClientsStore();

  const initInProgressRef = useRef(false);
  const walletMethodsRef = useRef<WalletMethodsRef>({
    [WalletMethods.getCapabilities]: getCapabilities,
    [WalletMethods.getCallsStatus]: getCallsStatus,
    [WalletMethods.sendCalls]: sendCalls,
    [WalletMethods.waitForCallsStatus]: waitForCallsStatus,
  });

  const {
    zapData,
    isSuccess: isZapDataSuccess,
    depositTokenData,
    depositTokenDecimals,
    isLoadingDepositTokenData,
    refetchDepositToken,
  } = useEnhancedZapData(projectData);

  const { account } = useAccount();
  const { address, chainId } = account;
  const { data: walletClient } = useWalletClient({
    chainId: chainId,
    account: address as EVMAddress,
    query: {
      enabled: !!chainId && !!address,
    },
  });

  const sendCallsExtraParams = useMemo(
    () => ({
      address,
      chainId,
      currentRoute,
      zapData,
      projectData,
    }),
    [chainId, currentRoute, zapData, projectData, address],
  );

  // Check if oNexus and meeClient are initialized before rendering
  const isInitialized = hasProjectClients(
    projectData.address as EVMAddress | undefined,
    projectData.chainId,
  );

  const isInitializedForCurrentChain = useMemo(() => {
    return (
      hasWalletClients(
        projectData.address as EVMAddress | undefined,
        projectData.chainId,
        address as EVMAddress | undefined,
        chainId,
      ) &&
      currentRoute?.fromAddress === address &&
      currentRoute?.fromChainId === chainId
    );
  }, [
    chainId,
    address,
    currentRoute,
    projectData.address,
    projectData.chainId,
  ]);

  const handleSetCurrentRoute = useCallback((newRoute: Route) => {
    setCurrentRoute((prevRoute) => {
      if (newRoute.id === prevRoute?.id) {
        return prevRoute;
      }
      return newRoute;
    });
  }, []);

  // RPC operation queueing
  const queueOperation = useCallback(
    async <T extends WalletMethods>(
      operationName: T,
      args: WalletMethodArgsType<T>,
    ): Promise<ReturnType<WalletMethodsRef[T]>> => {
      const operation = walletMethodsRef.current?.[operationName] as
        | WalletMethodsRef[T]
        | undefined;

      if (!operation) {
        throw new Error(`Operation ${operationName} not found`);
      }

      const biconomyClients = await getClients(
        sendCallsExtraParams.projectData.address as EVMAddress,
        sendCallsExtraParams.chainId,
        sendCallsExtraParams.projectData.chainId,
        walletClient,
      );

      if (!biconomyClients) {
        const operationId = `${operationName}-${sendCallsExtraParams.currentRoute?.id}`;

        console.warn(
          'Queued operation:',
          operationName,
          'with id:',
          operationId,
        );

        return new Promise<WalletMethodReturnType<T>>((resolve, reject) => {
          addPendingOperation(
            operationId,
            operationName,
            args,
            resolve,
            reject,
          );
        });
      }

      return operation(
        args as any,
        biconomyClients.meeClient,
        biconomyClients.oNexus,
        sendCallsExtraParams,
      ) as Promise<WalletMethodReturnType<T>>;
    },
    [sendCallsExtraParams, walletClient, getClients],
  );

  // Execute pending operations when clients are ready
  useEffect(() => {
    const executePendingOperations = async () => {
      const pendingOps = Object.values(pendingOperations);
      console.warn(`Executing ${pendingOps.length} pending operations`);

      const biconomyClients = await getClients(
        sendCallsExtraParams.projectData.address as EVMAddress,
        sendCallsExtraParams.chainId,
        sendCallsExtraParams.projectData.chainId,
        walletClient,
      );

      if (!biconomyClients) {
        throw new Error('Failed to get biconomy clients');
      }

      // Execute all pending operations
      for (const pendingOp of pendingOps) {
        if (
          !pendingOp.id.endsWith(sendCallsExtraParams.currentRoute?.id ?? '')
        ) {
          console.warn(
            `Skipping operation ${pendingOp.id} because it's not the current route: ${sendCallsExtraParams.currentRoute?.id}`,
          );
          continue;
        }

        console.warn(
          `Executing ${pendingOp.operationName}`,
          sendCallsExtraParams,
        );

        const resolvers = getPromiseResolversForOperation(pendingOp.id);

        try {
          const operation = walletMethodsRef.current?.[pendingOp.operationName];
          if (!operation) {
            console.warn(`Operation ${pendingOp.operationName} not found`);
            continue;
          }

          const result = await operation(
            pendingOp.args as any,
            biconomyClients.meeClient,
            biconomyClients.oNexus,
            sendCallsExtraParams,
          );

          if (resolvers?.resolve) {
            resolvers.resolve(
              result as unknown as WalletMethodReturnType<
                typeof pendingOp.operationName
              >,
            );
          }

          // Remove the operation from store
          removePendingOperation(pendingOp.id);
        } catch (error) {
          console.error(
            `Failed to execute operation ${pendingOp.operationName}:`,
            error,
          );

          if (resolvers?.reject) {
            resolvers.reject(error as Error);
          }

          // Remove the operation from store
          removePendingOperation(pendingOp.id);
        }
      }
    };

    if (walletClient && Object.keys(pendingOperations).length > 0) {
      executePendingOperations();
    }
  }, [
    pendingOperations,
    sendCallsExtraParams,
    walletClient,
    getClients,
    getPromiseResolversForOperation,
    removePendingOperation,
  ]);

  // Enhanced initialization with retry logic and better error handling
  useEffect(() => {
    if (isInitializedForCurrentChain) {
      console.warn('Clients already initialised for this chain');
      return;
    }

    if (initInProgressRef.current) {
      console.warn('Already initializing, skipping...');
      return;
    }

    console.warn(
      'Starting client initialization for chain:',
      chainId,
      'address:',
      address,
    );

    const initMeeClient = async () => {
      try {
        initInProgressRef.current = true;

        const biconomyClients = await getClients(
          projectData.address as EVMAddress,
          chainId,
          projectData.chainId,
          walletClient,
        );

        if (!biconomyClients) {
          console.warn('Failed to get biconomy clients');
          return;
        }
      } catch (error) {
        console.error('Failed to initialize clients:', error);
      } finally {
        initInProgressRef.current = false;
      }
    };

    initMeeClient();
  }, [
    chainId,
    projectData.chainId,
    address,
    walletClient,
    isInitializedForCurrentChain,
    getClients,
  ]);

  const wagmiConfig = useConfig();

  const providers = useMemo(() => {
    return [
      createCustomEVMProvider({
        wagmiConfig,
        getCapabilities: async (_, args) => {
          console.warn('getCapabilities');
          return queueOperation(WalletMethods.getCapabilities, args);
        },
        getCallsStatus: async (_, args) => {
          console.warn('getCallsStatus');
          return queueOperation(WalletMethods.getCallsStatus, args);
        },
        sendCalls: async (_, args) => {
          console.warn('sendCalls');
          return queueOperation(WalletMethods.sendCalls, args);
        },
        waitForCallsStatus: async (_, args) => {
          console.warn('waitForCallsStatus');
          return queueOperation(WalletMethods.waitForCallsStatus, args);
        },
      }),
    ];
  }, [wagmiConfig, queueOperation, isInitializedForCurrentChain]);

  const toAddress = useMemo(
    () =>
      getToAddress(
        projectData.address as EVMAddress | undefined,
        chainId,
        projectData.chainId,
        address as EVMAddress | undefined,
      ),
    [chainId, address, projectData.chainId, projectData.address, getToAddress],
  );

  const isConnected = account.isConnected && !!address;

  const value = useMemo(() => {
    return {
      isInitialized,
      isInitializedForCurrentChain,
      isConnected,
      providers,
      toAddress,
      zapData,
      isZapDataSuccess,
      setCurrentRoute: handleSetCurrentRoute,
      depositTokenData,
      depositTokenDecimals,
      isLoadingDepositTokenData,
      refetchDepositToken,
    };
  }, [
    isInitialized,
    isInitializedForCurrentChain,
    isConnected,
    providers,
    toAddress,
    zapData,
    isZapDataSuccess,
    depositTokenData,
    depositTokenDecimals,
    isLoadingDepositTokenData,
    refetchDepositToken,
    handleSetCurrentRoute,
  ]);

  return (
    <ZapInitContext.Provider value={value}>{children}</ZapInitContext.Provider>
  );
};
