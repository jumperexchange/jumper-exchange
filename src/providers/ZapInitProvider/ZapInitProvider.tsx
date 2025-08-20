'use client';

import { ChainId, EVMProvider, Route } from '@lifi/sdk';
import { useAccount } from '@lifi/wallet-management';
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useEnhancedZapData } from 'src/hooks/zaps/useEnhancedZapData';
import { createCustomEVMProvider } from 'src/providers/WalletProvider/createCustomEVMProvider';
import { EVMAddress } from 'src/types/internal';
import { ProjectData } from 'src/types/questDetails';
import { useConfig, UseReadContractsReturnType, useSwitchChain } from 'wagmi';
import {
  WalletMethod,
  WalletMethodsRef,
  WalletMethodArgsType,
  WalletMethodReturnType,
  WalletMethodDefinition,
} from './types';
import {
  BiconomyClients,
  useBiconomyClientsStore,
} from 'src/stores/biconomyClients/BiconomyClientsStore';
import { useZapPendingOperationsStore } from 'src/stores/zapPendingOperations/ZapPendingOperationsStore';
import { walletMethods } from './WalletClient/methods';
import { useWalletClientInitialization } from './WalletClient/hooks';
import { SendCallsExtraParams } from './ModularZaps';
import { NO_DEPS_METHODS } from './constants';
import { openInNewTab } from 'src/utils/openInNewTab';
import {
  BICONOMY_EXPLORER_ADDRESS_PATH,
  BICONOMY_EXPLORER_URL,
} from 'src/components/Widgets/variants/widgetConfig/base/useZapRPC';
import { findChain } from 'src/utils/chains/findChain';
import { useZapSupportedChains } from 'src/hooks/zaps/useZapSupportedChains';
import { useZapQuestIdStorage } from '../hooks';

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
  allowedChains: ChainId[];
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
  allowedChains: [],
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
  const {
    setCurrentRoute,
    getCurrentRoute,
    addPendingOperation,
    removePendingOperation,
    getPendingOperationsForFromValues,
    getPromiseResolversForOperation,
  } = useZapPendingOperationsStore();

  const pendingOperationsLength = useZapPendingOperationsStore(
    (state) => Object.keys(state.pendingOperations).length,
  );

  const currentRoute = useZapPendingOperationsStore(
    (state) => state.currentRoute,
  );

  const allowedChains = useMemo(() => {
    // @Note: This is a fallback for when the zap supported chains are not loaded yet
    if (!zapSupportedChains) {
      return [
        ChainId.ETH,
        ChainId.BSC,
        ChainId.ARB,
        ChainId.BAS,
        ChainId.AVA,
        ChainId.POL,
        ChainId.SCL,
        ChainId.OPT,
        ChainId.DAI,
        ChainId.UNI,
        ChainId.SEI,
        ChainId.SON,
        ChainId.APE,
        ChainId.WCC,
        ChainId.HYP,
        // @Note: Even though docs say they are supported, they are not retrieved from the API
        // https://docs.biconomy.io/supportedNetworks#-supported-chains
        // ChainId.KAT,
        // ChainId.LSK,
      ];
    }

    const zapSupportedChainsIds = zapSupportedChains.map(
      (chain) => chain.chainId,
    );

    return Object.values(ChainId).filter((chainId): chainId is ChainId =>
      zapSupportedChainsIds?.includes(chainId.toString()),
    );
  }, [zapSupportedChains]);

  const { initializeClients } = useWalletClientInitialization(allowedChains);

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

  const { switchChainAsync } = useSwitchChain();

  const sendCallsExtraParams = useMemo(
    () => ({
      zapData,
      projectData,
    }),
    [zapData, projectData],
  );

  const isConnected = account.isConnected && !!address;

  // Check if oNexus and meeClient are initialized before rendering
  const isInitialized = useBiconomyClientsStore((state) => {
    console.warn('🔍 isInitialized selector running');
    return (
      isConnected &&
      state.hasClient(
        projectData.address as EVMAddress | undefined,
        projectData.chainId,
        address as EVMAddress | undefined,
      )
    );
  });

  const isInitializedForCurrentChain = useBiconomyClientsStore((state) => {
    console.warn('🔍 isInitializedForCurrentChain selector running');
    return (
      (isInitialized && !currentRoute) ||
      state.hasChainClients(
        projectData.address as EVMAddress | undefined,
        projectData.chainId,
        currentRoute?.fromAddress as EVMAddress | undefined,
        currentRoute?.fromChainId,
      )
    );
  });

  const toAddress = useBiconomyClientsStore((state) => {
    console.warn('🔍 toAddress selector running');
    return state.getToAddress(
      projectData.address as EVMAddress | undefined,
      projectData.chainId,
      address as EVMAddress | undefined,
    );
  });

  // RPC operation queueing
  const queueOperation = async <T extends WalletMethod>(
    operationName: T,
    args: WalletMethodArgsType<T>,
    extraParams: Omit<SendCallsExtraParams, 'currentRoute'>,
  ): Promise<ReturnType<WalletMethodsRef[T]>> => {
    const operation = walletMethods[operationName] as
      | WalletMethodsRef[T]
      | undefined;

    if (!operation) {
      throw new Error(`Operation ${operationName} not found`);
    }

    let biconomyClients: BiconomyClients | null = null;
    const actualCurrentRoute = getCurrentRoute();

    try {
      const clients = await initializeClients({
        address: actualCurrentRoute?.fromAddress as EVMAddress,
        chainId: actualCurrentRoute?.fromChainId,
        projectAddress: extraParams.projectData.address as EVMAddress,
        projectChainId: extraParams.projectData.chainId,
      });

      biconomyClients = clients.biconomyClients;
    } catch (error) {
      console.error(
        'Failed to initialize clients inside queueOperation:',
        error,
      );
    }

    const isMethodWithDeps = !NO_DEPS_METHODS.has(operationName);

    // Skip this for wallet_getCapabilities method
    // Queue the operation if either the biconomy clients are not initialized or the current route is not set
    if (isMethodWithDeps && (!biconomyClients || !actualCurrentRoute)) {
      return new Promise<WalletMethodReturnType<T>>((resolve, reject) => {
        addPendingOperation(operationName, args, resolve, reject);
      });
    }

    return (
      operation as WalletMethodDefinition<
        WalletMethodArgsType<T>,
        Awaited<WalletMethodReturnType<T>>
      >
    )(args, biconomyClients?.meeClient, biconomyClients?.oNexus, {
      ...extraParams,
      currentRoute: actualCurrentRoute,
    });
  };

  // Execute pending operations when clients are ready
  useEffect(() => {
    const executePendingOperations = async () => {
      const actualCurrentRoute = getCurrentRoute();
      const filteredPendingOps = getPendingOperationsForFromValues(
        actualCurrentRoute?.fromAddress,
        actualCurrentRoute?.fromChainId,
      );

      console.warn(
        `Preparing to execute ${filteredPendingOps.length}/${pendingOperationsLength} pending operations`,
      );

      let biconomyClients: BiconomyClients | null = null;

      try {
        const clients = await initializeClients({
          address: actualCurrentRoute?.fromAddress as EVMAddress,
          chainId: actualCurrentRoute?.fromChainId,
          projectAddress: sendCallsExtraParams.projectData
            .address as EVMAddress,
          projectChainId: sendCallsExtraParams.projectData.chainId,
        });

        biconomyClients = clients.biconomyClients;
      } catch (error) {
        console.error(
          'Failed to initialize clients inside executePendingOperations:',
          error,
        );
      }

      // Execute all pending operations sequentially
      for (const pendingOp of filteredPendingOps) {
        const isMethodWithDeps = !NO_DEPS_METHODS.has(pendingOp.operationName);

        if (isMethodWithDeps && (!biconomyClients || !pendingOp.routeContext)) {
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
            {
              ...sendCallsExtraParams,
              currentRoute: pendingOp.routeContext,
            },
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

    if (pendingOperationsLength > 0) {
      executePendingOperations();
    }
  }, [
    pendingOperationsLength,
    getPendingOperationsForFromValues,
    sendCallsExtraParams,
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
  }, [
    chainId,
    address,
    projectData.chainId,
    projectData.address,
    initializeClients,
  ]);

  // @Note: This is a hack to fix the broken address link; will be removed
  useEffect(() => {
    const explorerUrl = projectData.chainId
      ? findChain(projectData.chainId)?.blockExplorers?.default.url
      : undefined;

    if (!explorerUrl) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a');

      if (
        link?.href.includes(
          `${BICONOMY_EXPLORER_URL}/${BICONOMY_EXPLORER_ADDRESS_PATH}`,
        )
      ) {
        event.preventDefault();
        const linkWalletAddress = link.href
          .split(`/${BICONOMY_EXPLORER_ADDRESS_PATH}/`)
          .pop();
        if (linkWalletAddress) {
          openInNewTab(
            `${explorerUrl}/${BICONOMY_EXPLORER_ADDRESS_PATH}/${linkWalletAddress}`,
          );
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [projectData.chainId]);

  useEffect(() => {
    useZapPendingOperationsStore.setState({
      currentRoute: null,
    });
  }, [address]);

  useEffect(() => {
    return () => {
      useZapPendingOperationsStore.setState({
        currentRoute: null,
      });
    };
  }, []);

  const providers = [
    createCustomEVMProvider({
      wagmiConfig,
      getCapabilities: async (_, args) => {
        console.warn('getCapabilities');
        return queueOperation(
          'wallet_getCapabilities',
          args,
          sendCallsExtraParams,
        );
      },
      getCallsStatus: async (_, args) => {
        console.warn('getCallsStatus');
        return queueOperation(
          'wallet_getCallsStatus',
          args,
          sendCallsExtraParams,
        );
      },
      sendCalls: async (_, args) => {
        console.warn('sendCalls');
        return queueOperation('wallet_sendCalls', args, sendCallsExtraParams);
      },
      waitForCallsStatus: async (_, args) => {
        console.warn('waitForCallsStatus');
        return queueOperation(
          'wallet_waitForCallsStatus',
          args,
          sendCallsExtraParams,
        );
      },
    }),
  ];

  useEffect(() => {
    if (chainId && !allowedChains.includes(chainId)) {
      switchChainAsync({ chainId: ChainId.ETH });
    }
  }, [chainId, allowedChains, switchChainAsync]);

  const value = useMemo(() => {
    return {
      isInitialized,
      isInitializedForCurrentChain,
      isConnected,
      providers,
      toAddress,
      zapData,
      isZapDataSuccess,
      setCurrentRoute,
      depositTokenData,
      depositTokenDecimals,
      isLoadingDepositTokenData,
      refetchDepositToken,
      allowedChains,
    };
  }, [
    providers,
    toAddress,
    isInitialized,
    isInitializedForCurrentChain,
    isConnected,
    zapData,
    isZapDataSuccess,
    depositTokenData,
    depositTokenDecimals,
    isLoadingDepositTokenData,
    refetchDepositToken,
    setCurrentRoute,
    allowedChains,
  ]);

  return (
    <ZapInitContext.Provider value={value}>{children}</ZapInitContext.Provider>
  );
};
