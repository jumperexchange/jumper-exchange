'use client';

import { ChainId, ChainType, EVMProvider, Route } from '@lifi/sdk';
import { useAccount } from '@lifi/wallet-management';
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
import {
  BICONOMY_EXPLORER_ADDRESS_PATH,
  BICONOMY_EXPLORER_URL,
} from 'src/components/Widgets/variants/widgetConfig/base/useZapRPC';
import { useMultisig } from 'src/hooks/useMultisig';
import { useEnhancedZapData } from 'src/hooks/zaps/useEnhancedZapData';
import { useZapSupportedChains } from 'src/hooks/zaps/useZapSupportedChains';
import { createCustomEVMProvider } from 'src/providers/WalletProvider/createCustomEVMProvider';
import {
  BiconomyClients,
  useBiconomyClientsStore,
} from 'src/stores/biconomyClients/BiconomyClientsStore';
import { useZapPendingOperationsStore } from 'src/stores/zapPendingOperations/ZapPendingOperationsStore';
import { ProjectData } from 'src/types/questDetails';
import { findChain } from 'src/utils/chains/findChain';
import { openInNewTab } from 'src/utils/openInNewTab';
import { Hex } from 'viem';
import { useConfig, UseReadContractsReturnType, useSwitchChain } from 'wagmi';
import { useZapQuestIdStorage } from '../hooks';
import { SendCallsExtraParams } from './ModularZaps';
import { useWalletClientInitialization } from './WalletClient/hooks';
import { walletMethods } from './WalletClient/methods';
import { NO_DEPS_METHODS } from './constants';
import {
  WalletMethod,
  WalletMethodArgsType,
  WalletMethodDefinition,
  WalletMethodReturnType,
  WalletMethodsRef,
} from './types';

interface ZapInitState {
  isInitialized: boolean;
  isInitializedForCurrentChain: boolean;
  isMultisigEnvironment: boolean;
  isEmbeddedWallet: boolean;
  isEvmWallet: boolean;
  isConnected: boolean;
  providers: EVMProvider[];
  toAddress?: Hex;
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
  isMultisigEnvironment: false,
  isEmbeddedWallet: false,
  isEvmWallet: false,
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
    setProcessingPendingOperation,
  } = useZapPendingOperationsStore();

  const { checkMultisigEnvironment } = useMultisig();
  const [isMultisigEnvironment, setIsMultisigEnvironment] = useState(false);
  const [isEmbeddedWallet, setIsEmbeddedWallet] = useState(false);

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
  const isExecutingPendingOpsInProgressRef = useRef(false);

  const {
    zapData,
    isSuccess: isZapDataSuccess,
    depositTokenData,
    depositTokenDecimals,
    isLoadingDepositTokenData,
    refetchDepositToken,
  } = useEnhancedZapData(projectData);

  const { account } = useAccount();
  const { address, chainId, chainType } = account;
  const isEvmWallet = chainType === ChainType.EVM;

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
    return (
      isConnected &&
      state.hasClient(
        projectData.address as Hex | undefined,
        projectData.chainId,
        address as Hex | undefined,
      )
    );
  });

  const isInitializedForCurrentChain = useBiconomyClientsStore((state) => {
    return (
      (isInitialized && !currentRoute) ||
      state.hasChainClients(
        projectData.address as Hex | undefined,
        projectData.chainId,
        currentRoute?.fromAddress as Hex | undefined,
        currentRoute?.fromChainId,
      )
    );
  });

  const toAddress = useBiconomyClientsStore((state) => {
    const valueFromStore = state.getToAddress(
      projectData.address as Hex | undefined,
      projectData.chainId,
      address as Hex | undefined,
    );
    return valueFromStore;
  });

  // RPC operation queueing
  const queueOperation = async <T extends WalletMethod>(
    operationName: T,
    args: WalletMethodArgsType<T>,
    extraParams: Omit<
      SendCallsExtraParams,
      'currentRoute' | 'isEmbeddedWallet'
    >,
  ): Promise<ReturnType<WalletMethodsRef[T]>> => {
    const operation = walletMethods[operationName] as
      | WalletMethodsRef[T]
      | undefined;

    if (!operation) {
      throw new Error(`Operation ${operationName} not found`);
    }

    let biconomyClients: BiconomyClients | null = null;
    let isCurrentEmbeddedWallet: boolean = false;
    const actualCurrentRoute = getCurrentRoute();

    try {
      const clients = await initializeClients({
        address: actualCurrentRoute?.fromAddress as Hex,
        chainId: actualCurrentRoute?.fromChainId,
        projectAddress: extraParams.projectData.address as Hex,
        projectChainId: extraParams.projectData.chainId,
      });

      biconomyClients = clients.biconomyClients;
      isCurrentEmbeddedWallet = clients.isEmbeddedWallet;
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
      isEmbeddedWallet: isCurrentEmbeddedWallet,
    });
  };

  // Execute pending operations when clients are ready
  useEffect(() => {
    const executePendingOperations = async () => {
      if (isExecutingPendingOpsInProgressRef.current) {
        return;
      }

      isExecutingPendingOpsInProgressRef.current = true;

      try {
        const actualCurrentRoute = getCurrentRoute();
        const filteredPendingOps = getPendingOperationsForFromValues(
          actualCurrentRoute?.fromAddress,
          actualCurrentRoute?.fromChainId,
        );

        if (filteredPendingOps.length === 0) {
          return;
        }

        let biconomyClients: BiconomyClients | null = null;
        let isCurrentEmbeddedWallet: boolean = false;

        try {
          const clients = await initializeClients({
            address: actualCurrentRoute?.fromAddress as Hex,
            chainId: actualCurrentRoute?.fromChainId,
            projectAddress: sendCallsExtraParams.projectData.address as Hex,
            projectChainId: sendCallsExtraParams.projectData.chainId,
          });

          biconomyClients = clients.biconomyClients;
          isCurrentEmbeddedWallet = clients.isEmbeddedWallet;
        } catch (error) {
          console.error(
            'Failed to initialize clients inside executePendingOperations:',
            error,
          );
        }

        // Execute all pending operations sequentially
        for (const pendingOp of filteredPendingOps) {
          const isMethodWithDeps = !NO_DEPS_METHODS.has(
            pendingOp.operationName,
          );

          if (
            isMethodWithDeps &&
            (!biconomyClients || !pendingOp.routeContext)
          ) {
            continue;
          }

          const resolvers = getPromiseResolversForOperation(pendingOp.id);

          try {
            const operation = walletMethods[pendingOp.operationName];
            if (!operation) {
              continue;
            }

            setProcessingPendingOperation(pendingOp.id);

            const result = await operation(
              pendingOp.args as any,
              biconomyClients?.meeClient,
              biconomyClients?.oNexus,
              {
                ...sendCallsExtraParams,
                currentRoute: pendingOp.routeContext,
                isEmbeddedWallet: isCurrentEmbeddedWallet,
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
      } catch (error) {
        console.error('Failed to execute pending operations:', error);
      } finally {
        isExecutingPendingOpsInProgressRef.current = false;
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
    setProcessingPendingOperation,
  ]);

  // Enhanced initialization with retry logic and better error handling
  // @Note this is needed for the initial clients initialization
  useEffect(() => {
    if (initInProgressRef.current) {
      return;
    }

    if (!chainId || !address) {
      return;
    }

    const initMeeClient = async () => {
      const isMultisig = await checkMultisigEnvironment();
      if (isMultisig) {
        setIsMultisigEnvironment(true);
        return;
      }

      try {
        initInProgressRef.current = true;

        const clients = await initializeClients({
          address: address as Hex,
          chainId,
          projectAddress: projectData.address as Hex,
          projectChainId: projectData.chainId,
        });

        if (clients.isEmbeddedWallet) {
          setIsEmbeddedWallet(true);
          return;
        }

        if (!clients.biconomyClients) {
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
    checkMultisigEnvironment,
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

    return () => {
      setIsMultisigEnvironment(false);
      setIsEmbeddedWallet(false);
    };
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
        return queueOperation(
          'wallet_getCapabilities',
          args,
          sendCallsExtraParams,
        );
      },
      getCallsStatus: async (_, args) => {
        return queueOperation(
          'wallet_getCallsStatus',
          args,
          sendCallsExtraParams,
        );
      },
      sendCalls: async (_, args) => {
        return queueOperation('wallet_sendCalls', args, sendCallsExtraParams);
      },
      waitForCallsStatus: async (_, args) => {
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
      isMultisigEnvironment,
      isEmbeddedWallet,
      isEvmWallet,
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
    isMultisigEnvironment,
    isEmbeddedWallet,
    isEvmWallet,
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
