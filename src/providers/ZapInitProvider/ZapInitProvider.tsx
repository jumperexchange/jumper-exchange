'use client';

import {
  createMeeClient,
  GetFusionQuoteParams,
  MeeClient,
  MultichainSmartAccount,
  toMultichainNexusAccount,
  WaitForSupertransactionReceiptPayload,
} from '@biconomy/abstractjs';
import { EVMProvider, getTokenBalance, Route, Token } from '@lifi/sdk';
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
import { retryWithBackoff } from 'src/utils/retryWithBackoff';
import { Chain, http, zeroAddress } from 'viem';
import * as chains_ from 'viem/chains';
import { useConfig, UseReadContractsReturnType, useWalletClient } from 'wagmi';
import * as hyperwave from './hyperwave';
import * as katana from './katana';
import { buildContractInstructions, SendCallsExtraParams } from './ModularZaps';
import {
  WalletCall,
  WalletCapabilitiesArgs,
  WalletGetCallsStatusArgs,
  WalletMethods,
  WalletSendCallsArgs,
  WalletWaitForCallsStatusArgs,
  WalletMethodsRef,
  WalletMethodArgsType,
  ExtraParams,
  WalletMethodReturnType,
} from './types';
import { useBiconomyClientsStore } from 'src/stores/biconomyClients/BiconomyClientsStore';
import { useZapPendingOperationsStore } from 'src/stores/zapPendingOperations/ZapPendingOperationsStore';

interface ZapInitState {
  isInitialized: boolean;
  isInitializedForCurrentChain: boolean;
  isConnected: boolean;
  providers: EVMProvider[];
  toAddress?: EVMAddress;
  zapData?: any;
  isZapDataSuccess: boolean;
  setCurrentRoute: (route: Route | null) => void;
  depositTokenData: number | bigint | undefined;
  depositTokenDecimals: number | bigint | undefined;
  isLoadingDepositTokenData: boolean;
  refetchDepositToken: UseReadContractsReturnType['refetch'];
}

const isSameToken = (a: Token, b: Token) => {
  return a.address === b.address && a.chainId === b.chainId;
};

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

const chains: Record<number, Chain> = {
  ...chains_,
  [999]: hyperwave.hyperevm,
  [747474]: katana.katana,
};

export const ZapInitProvider: FC<ZapInitProviderProps> = ({
  children,
  projectData,
}) => {
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
  // @TODO might need to handle the persisted pending operations a bit differently,
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
  const walletMethodsRef = useRef<WalletMethodsRef | null>(null);

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

  // RPC operation queueing
  // @TODO persist the pending operations
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

      if (!isInitializedForCurrentChain || !biconomyClients) {
        const operationId = `${operationName}-${Date.now()}-${Math.random()}`;

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
    [
      isInitializedForCurrentChain,
      sendCallsExtraParams,
      walletClient,
      getClients,
    ],
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

    if (
      isInitializedForCurrentChain &&
      walletClient &&
      Object.keys(pendingOperations).length > 0
    ) {
      executePendingOperations();
    }
  }, [
    isInitializedForCurrentChain,
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

  const handleGetCapabilities = useCallback(
    async (
      args: WalletCapabilitiesArgs,
      meeClientParam: MeeClient,
      oNexusParam: MultichainSmartAccount,
      extraParams: ExtraParams,
    ): Promise<{
      atomic: { status: 'supported' | 'ready' | 'unsupported' };
    }> => {
      return Promise.resolve({
        atomic: { status: 'supported' },
      });
    },
    [],
  );

  // Helper function to handle 'wallet_getCallsStatus'
  const handleWalletGetCallsStatus = useCallback(
    async (
      args: WalletGetCallsStatusArgs,
      meeClientParam: MeeClient,
      oNexusParam: MultichainSmartAccount,
      extraParams: ExtraParams,
    ) => {
      if (!meeClientParam) {
        throw new Error('MEE client not initialized');
      }
      if (!args.params || !Array.isArray(args.params)) {
        throw new Error(
          'Invalid args.params structure for wallet_getCallsStatus',
        );
      }
      const hash = args.params[0];
      if (typeof hash !== 'string' || !hash) {
        throw new Error('Missing or invalid hash in params object');
      }

      const receipt = (await meeClientParam.waitForSupertransactionReceipt({
        hash: hash as EVMAddress,
      })) as WaitForSupertransactionReceiptPayload;

      const originalReceipts = receipt?.receipts || [];
      // Ensure the last receipt has the correct transactionHash format
      if (originalReceipts.length > 0) {
        originalReceipts[originalReceipts.length - 1].transactionHash =
          `biconomy:${hash}` as EVMAddress;
      }

      const chainIdAsNumber = receipt?.paymentInfo?.chainId;
      const hexChainId = chainIdAsNumber
        ? `0x${Number(chainIdAsNumber).toString(16)}`
        : undefined;

      const isSuccess = receipt?.transactionStatus
        ?.toLowerCase()
        .includes('success');
      const statusCode = isSuccess ? 200 : 400;

      return {
        atomic: true,
        chainId: hexChainId,
        id: hash,
        status: isSuccess ? 'success' : 'failed', // String status as expected by LiFi SDK
        statusCode, // Numeric status code
        receipts: originalReceipts.map((receipt) => ({
          transactionHash: receipt.transactionHash,
          status: receipt.status || (isSuccess ? 'success' : 'reverted'),
        })),
      };
    },
    [],
  );

  // Helper function to handle 'wallet_waitForCallsStatus'
  const handleWalletWaitForCallsStatus = useCallback(
    async (
      args: WalletWaitForCallsStatusArgs,
      meeClientParam: MeeClient,
      oNexusParam: MultichainSmartAccount,
      extraParams: ExtraParams,
    ) => {
      if (!meeClientParam) {
        throw new Error('MEE client not initialized');
      }
      if (!args.id) {
        throw new Error(
          'Invalid args structure for wallet_waitForCallsStatus: missing id',
        );
      }

      const { id, timeout = 60000 } = args;

      // waitForSupertransactionReceipt already waits for completion, so we don't need to poll
      // We'll use the timeout to set a maximum wait time
      const receipt = (await Promise.race([
        meeClientParam!.waitForSupertransactionReceipt({
          hash: id as EVMAddress,
        }),
        new Promise((_, reject) =>
          setTimeout(
            () =>
              reject(
                new Error(
                  `Timed out while waiting for call bundle with id "${id}" to be confirmed.`,
                ),
              ),
            timeout,
          ),
        ),
      ])) as WaitForSupertransactionReceiptPayload;

      // Now get the status using the same logic as handleWalletGetCallsStatus
      const originalReceipts = receipt?.receipts || [];
      if (originalReceipts.length > 0) {
        originalReceipts[originalReceipts.length - 1].transactionHash =
          `biconomy:${id}` as EVMAddress;
      }

      const chainIdAsNumber = receipt?.paymentInfo?.chainId;
      const hexChainId = chainIdAsNumber
        ? `0x${Number(chainIdAsNumber).toString(16)}`
        : undefined;

      const isSuccess = receipt?.transactionStatus
        ?.toLowerCase()
        .includes('success');
      const statusCode = isSuccess ? 200 : 400;

      return {
        atomic: true,
        chainId: hexChainId,
        id: id,
        status: isSuccess ? 'success' : 'failed',
        statusCode,
        receipts: originalReceipts.map((receipt) => ({
          transactionHash: receipt.transactionHash,
          status: receipt.status || (isSuccess ? 'success' : 'reverted'),
        })),
      };
    },
    [],
  );

  // @TODO split this function into smaller units
  // Helper function to handle 'wallet_sendCalls'
  const handleWalletSendCalls = useCallback(
    async (
      args: WalletSendCallsArgs,
      meeClientParam: MeeClient,
      oNexusParam: MultichainSmartAccount,
      sendCallsExtraParams: SendCallsExtraParams,
    ) => {
      if (!meeClientParam || !oNexusParam) {
        throw new Error('MEE client or oNexus not initialized');
      }

      // Handle the new args structure with account and calls directly
      if (!args.account || !args.calls) {
        throw new Error('Invalid args structure: Missing account or calls');
      }

      const { calls } = args;
      if (calls.length === 0) {
        throw new Error("'calls' array is empty");
      }

      if (!sendCallsExtraParams.chainId) {
        throw new Error('Cannot determine current chain ID from wallet.');
      }

      if (!sendCallsExtraParams.currentRoute) {
        throw new Error('Cannot process transaction: Route is undefined.');
      }
      if (!sendCallsExtraParams.zapData) {
        throw new Error('Integration data is not available.');
      }

      if (!sendCallsExtraParams.address) {
        throw new Error('No wallet address available.');
      }

      console.warn(
        'sendCallsExtraParams.currentRoute',
        sendCallsExtraParams.currentRoute,
      );

      const currentChainId = sendCallsExtraParams.chainId;
      const currentAddress = sendCallsExtraParams.address;
      const currentRouteFromToken = sendCallsExtraParams.currentRoute.fromToken;
      const currentRouteFromAmount =
        sendCallsExtraParams.currentRoute.fromAmount;
      const integrationData = sendCallsExtraParams.zapData;
      const depositToken = integrationData.market?.depositToken?.address;
      const depositChainId = sendCallsExtraParams.projectData.chainId;

      if (!depositChainId) {
        throw new Error('Deposit chain id is undefined.');
      }

      if (!depositToken) {
        throw new Error('Deposit token is undefined.');
      }

      // @Note this works only for EVM chains
      const isNativeSourceToken = currentRouteFromToken.address === zeroAddress;

      const isSameTokenDeposit = isSameToken(
        sendCallsExtraParams.currentRoute.fromToken,
        sendCallsExtraParams.currentRoute.toToken,
      );
      const baseCalls = isSameTokenDeposit ? [] : calls;

      // Build raw calldata instructions (general flow)
      const rawInstructions = await Promise.all(
        baseCalls.map(async (call: WalletCall) => {
          if (!call.to || !call.data) {
            throw new Error('Invalid call structure: Missing to or data field');
          }
          const data = {
            to: call.to,
            calldata: call.data,
            chainId: currentChainId,
            value: isNativeSourceToken ? BigInt(currentRouteFromAmount) : undefined,
          }
          return oNexusParam.buildComposable({
            type: 'rawCalldata',
            data,
          });
        }),
      );

      // Build project-specific contract instructions (approve, deposit, transfer)
      const contractInstructions = await buildContractInstructions(
        oNexusParam,
        sendCallsExtraParams,
      );

      // Combine all instructions
      const instructions = [...rawInstructions, ...contractInstructions];

      const currentTokenBalance = await getTokenBalance(
        currentAddress,
        currentRouteFromToken,
      );

      const userBalance = BigInt(currentTokenBalance?.amount ?? 0);
      const requestedAmount = BigInt(currentRouteFromAmount);

      const fusionQuoteParams: GetFusionQuoteParams = {
        trigger: {
          tokenAddress: currentRouteFromToken.address as EVMAddress,
          amount: requestedAmount,
          chainId: currentChainId,
        },
        cleanUps: [
          {
            tokenAddress: depositToken,
            chainId: depositChainId,
            recipientAddress: currentAddress as EVMAddress,
          },
        ],
        feeToken: {
          address: currentRouteFromToken.address as EVMAddress,
          chainId: currentChainId,
        },
        instructions,
      };

      // Calculate the percentage of the balance the user wants to use (in basis points)
      const usageInBasisPoints =
        userBalance > 0n ? (requestedAmount * 10_000n) / userBalance : 0n;

      // If the user is using ≥ 99.90% of their balance, we assume they intend to use max
      const isUsingMax = usageInBasisPoints >= 9_990n;

      if (isUsingMax) {
        fusionQuoteParams.trigger.useMaxAvailableFunds = true;
      }

      const quote = await meeClientParam.getFusionQuote(fusionQuoteParams);

      const { hash } = await meeClientParam.executeFusionQuote({
        fusionQuote: quote,
      });

      return { id: hash };
    },
    [],
  );

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

  useEffect(() => {
    walletMethodsRef.current = {
      [WalletMethods.getCapabilities]: handleGetCapabilities,
      [WalletMethods.getCallsStatus]: handleWalletGetCallsStatus,
      [WalletMethods.sendCalls]: handleWalletSendCalls,
      [WalletMethods.waitForCallsStatus]: handleWalletWaitForCallsStatus,
    };
  }, [
    handleGetCapabilities,
    handleWalletGetCallsStatus,
    handleWalletSendCalls,
    handleWalletWaitForCallsStatus,
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
      setCurrentRoute,
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
  ]);

  return (
    <ZapInitContext.Provider value={value}>{children}</ZapInitContext.Provider>
  );
};
