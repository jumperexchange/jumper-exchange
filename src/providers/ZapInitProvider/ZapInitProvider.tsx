'use client';

import { EVMProvider, Route } from '@lifi/sdk';
import { useAccount } from '@lifi/wallet-management';
import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
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
import { useConfig, UseReadContractsReturnType } from 'wagmi';
import {
  WalletMethods,
  WalletMethodsRef,
  WalletMethodArgsType,
  WalletMethodReturnType,
} from './types';
import {
  BiconomyClients,
  useBiconomyClientsStore,
} from 'src/stores/biconomyClients/BiconomyClientsStore';
import { useZapPendingOperationsStore } from 'src/stores/zapPendingOperations/ZapPendingOperationsStore';
import { walletMethods } from './WalletClient/methods';
import { useWalletClientInitialization } from './WalletClient/hooks';
import { SendCallsExtraParams } from './ModularZaps';
import { NO_DEPS_METHODS, NO_ROUTE_ID_SUFFIX } from './constants';

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
  const wagmiConfig = useConfig();
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
  // @Note: Might need to handle the persisted pending operations a bit differently
  // but it depends on the route execution logic which currently handles a single active route at a time
  const {
    pendingOperations,
    addPendingOperation,
    removePendingOperation,
    getPromiseResolversForOperation,
  } = useZapPendingOperationsStore();

  const { hasProjectClients, hasWalletClients, getToAddress } =
    useBiconomyClientsStore();

  const { initializeClients } = useWalletClientInitialization();

  const initInProgressRef = useRef(false);

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

  const sendCallsExtraParams = {
    address,
    chainId,
    currentRoute,
    zapData,
    projectData,
  };

  // Check if oNexus and meeClient are initialized before rendering
  const isInitialized = hasProjectClients(
    projectData.address as EVMAddress | undefined,
    projectData.chainId,
  );

  const isInitializedForCurrentChain =
    hasWalletClients(
      projectData.address as EVMAddress | undefined,
      projectData.chainId,
      address as EVMAddress | undefined,
      chainId,
    ) &&
    currentRoute?.fromAddress === address &&
    currentRoute?.fromChainId === chainId;

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
      extraParams: SendCallsExtraParams,
    ): Promise<ReturnType<WalletMethodsRef[T]>> => {
      const operation = walletMethods[operationName] as
        | WalletMethodsRef[T]
        | undefined;

      if (!operation) {
        throw new Error(`Operation ${operationName} not found`);
      }

      let biconomyClients: BiconomyClients | null = null;

      try {
        const clients = await initializeClients({
          address: extraParams.currentRoute?.fromAddress as EVMAddress,
          chainId: extraParams.chainId,
          projectAddress: extraParams.projectData.address as EVMAddress,
          projectChainId: extraParams.projectData.chainId,
        });

        biconomyClients = clients.biconomyClients;
      } catch (error) {
        console.error('Failed to initialize clients:', error);
      }

      const isMethodWithDeps = !NO_DEPS_METHODS.has(operationName);

      // Skip this for wallet_getCapabilities method
      // Queue the operation if either the biconomy clients are not initialized or the current route is not set
      if (isMethodWithDeps && (!biconomyClients || !extraParams.currentRoute)) {
        const operationId = `${operationName}-${extraParams.currentRoute?.id ?? NO_ROUTE_ID_SUFFIX}`;

        console.warn(
          `Queued operation: ${operationName} with id: ${operationId}`,
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
        biconomyClients?.meeClient,
        biconomyClients?.oNexus,
        extraParams,
      ) as Promise<WalletMethodReturnType<T>>;
    },
    [initializeClients],
  );

  // Execute pending operations when clients are ready
  useEffect(() => {
    const executePendingOperations = async () => {
      const pendingOps = Object.values(pendingOperations);
      const filteredPendingOps = pendingOps.filter(
        (pendingOp) =>
          pendingOp.id.endsWith(NO_ROUTE_ID_SUFFIX) ||
          (sendCallsExtraParams.currentRoute?.id &&
            pendingOp.id.endsWith(sendCallsExtraParams.currentRoute?.id)),
      );
      console.warn(
        `Preparing to execute ${filteredPendingOps.length}/${pendingOps.length} pending operations`,
      );

      let biconomyClients: BiconomyClients | null = null;

      try {
        const clients = await initializeClients({
          address: sendCallsExtraParams.currentRoute?.fromAddress as EVMAddress,
          chainId: sendCallsExtraParams.chainId,
          projectAddress: sendCallsExtraParams.projectData
            .address as EVMAddress,
          projectChainId: sendCallsExtraParams.projectData.chainId,
        });

        biconomyClients = clients.biconomyClients;
      } catch (error) {
        console.error('Failed to initialize clients:', error);
      }

      // Execute all pending operations sequentially
      for (const pendingOp of filteredPendingOps) {
        const isMethodWithDeps = !NO_DEPS_METHODS.has(pendingOp.operationName);

        if (
          isMethodWithDeps &&
          (!biconomyClients || !sendCallsExtraParams.currentRoute)
        ) {
          console.warn(
            `Skipping executing pending operation: ${pendingOp.operationName}`,
          );
          continue;
        }

        console.warn(
          `Executing ${pendingOp.operationName} with id: ${pendingOp.id}`,
        );

        const resolvers = getPromiseResolversForOperation(pendingOp.id);

        try {
          const operation = walletMethods[pendingOp.operationName];
          if (!operation) {
            console.warn(`Operation ${pendingOp.operationName} not found`);
            continue;
          }

          const result = await operation(
            pendingOp.args as any,
            biconomyClients?.meeClient,
            biconomyClients?.oNexus,
            sendCallsExtraParams,
          );

          if (resolvers?.resolve) {
            resolvers.resolve(
              result as unknown as WalletMethodReturnType<
                typeof pendingOp.operationName
              >,
            );
          }
        } catch (error) {
          console.error(
            `Failed to execute operation ${pendingOp.operationName}:`,
            error,
          );

          if (resolvers?.reject) {
            resolvers.reject(error as Error);
          }
        } finally {
          removePendingOperation(pendingOp.id);
        }
      }
    };

    if (Object.keys(pendingOperations).length > 0) {
      executePendingOperations();
    }
  }, [
    pendingOperations,
    JSON.stringify(sendCallsExtraParams),
    isInitializedForCurrentChain,
    initializeClients,
    getPromiseResolversForOperation,
    removePendingOperation,
  ]);

  // Enhanced initialization with retry logic and better error handling
  useEffect(() => {
    if (initInProgressRef.current) {
      console.warn('Already initializing, skipping...');
      return;
    }

    if (!chainId || !address) {
      console.warn('No chain id or address, skipping...');
      return;
    }

    const initMeeClient = async () => {
      try {
        initInProgressRef.current = true;

        const { biconomyClients } = await initializeClients({
          address: address as EVMAddress,
          chainId,
          projectAddress: projectData.address as EVMAddress,
          projectChainId: projectData.chainId,
        });

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
  }, [chainId, projectData.chainId, address, initializeClients]);

  const providers = useMemo(() => {
    return [
      createCustomEVMProvider({
        wagmiConfig,
        getCapabilities: async (_, args) => {
          console.warn('getCapabilities');
          return queueOperation(
            WalletMethods.getCapabilities,
            args,
            sendCallsExtraParams,
          );
        },
        getCallsStatus: async (_, args) => {
          console.warn('getCallsStatus');
          return queueOperation(
            WalletMethods.getCallsStatus,
            args,
            sendCallsExtraParams,
          );
        },
        sendCalls: async (_, args) => {
          console.warn('sendCalls');
          return queueOperation(
            WalletMethods.sendCalls,
            args,
            sendCallsExtraParams,
          );
        },
        waitForCallsStatus: async (_, args) => {
          console.warn('waitForCallsStatus');
          return queueOperation(
            WalletMethods.waitForCallsStatus,
            args,
            sendCallsExtraParams,
          );
        },
      }),
    ];
  }, [
    wagmiConfig,
    queueOperation,
    isInitialized,
    isInitializedForCurrentChain,
    JSON.stringify(sendCallsExtraParams),
  ]);

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
