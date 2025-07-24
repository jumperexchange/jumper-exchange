'use client';

import { EVMProvider, Route, getTokenBalance } from '@lifi/sdk';
import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useRef,
} from 'react';
import { UseReadContractsReturnType } from 'wagmi';
import {
  MultichainSmartAccount,
  MeeClient,
  toMultichainNexusAccount,
  createMeeClient,
  WaitForSupertransactionReceiptPayload,
  greaterThanOrEqualTo,
  runtimeERC20BalanceOf,
  GetFusionQuoteParams,
} from '@biconomy/abstractjs';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { buildContractComposable } from './utils';
import { createCustomEVMProvider } from 'src/providers/WalletProvider/createCustomEVMProvider';
import { http, parseUnits, zeroAddress } from 'viem';
import * as chains from 'viem/chains';
import { useWalletClient, useConfig } from 'wagmi';
import { useAccount } from '@lifi/wallet-management';
import {
  WalletCapabilitiesArgs,
  WalletGetCallsStatusArgs,
  WalletWaitForCallsStatusArgs,
  WalletSendCallsArgs,
  WalletCall,
  AbiInput,
  WalletPendingOperation,
  WalletPendingOperations,
  WalletMethods,
} from './types';
import { useEnhancedZapData } from 'src/hooks/zaps/useEnhancedZapData';
import { ProjectData } from 'src/types/questDetails';
import { EVMAddress } from 'src/types/internal';

interface ZapInitState {
  isInitialized: boolean;
  isInitializedForCurrentChain: boolean;
  isConnected: boolean;
  providers: EVMProvider[];
  toAddress?: EVMAddress;
  zapData?: any;
  isZapDataSuccess: boolean;
  setCurrentRoute: Dispatch<SetStateAction<Route | null>>;
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
  const [oNexus, setONexus] = useState<MultichainSmartAccount | null>(null);
  const [meeClient, setMeeClient] = useState<MeeClient | null>(null);
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
  const [pendingOperations, setPendingOperations] =
    useState<WalletPendingOperations>({});

  const lastInitRef = useRef<{ chainId?: number; address?: string }>({});
  const resetInProgressRef = useRef(false);
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
  const { data: walletClient } = useWalletClient({
    chainId: chainId,
    account: address as EVMAddress,
    query: {
      enabled: !!chainId && !!address,
    },
  });

  // Check if oNexus and meeClient are initialized before rendering
  const isInitialized = !!oNexus && !!meeClient;

  const sendCallsExtraParams = useMemo(
    () => ({
      chainId,
      currentRoute,
      zapData,
      projectData,
      address,
    }),
    [chainId, currentRoute, zapData, projectData, address],
  );

  const isInitializedForCurrentChain = useMemo(() => {
    return (
      isInitialized &&
      !resetInProgressRef.current &&
      !initInProgressRef.current &&
      lastInitRef.current.chainId === chainId &&
      lastInitRef.current.address === address &&
      currentRoute?.fromAddress === address &&
      currentRoute?.fromChainId === chainId
    );
  }, [
    isInitialized,
    chainId,
    address,
    currentRoute,
    resetInProgressRef.current,
    initInProgressRef.current,
    lastInitRef.current,
  ]);

  // RPC operation queueing
  const queueOperation = useCallback(
    (
      operationName: WalletMethods,
      operation: WalletPendingOperation['operation'],
    ) => {
      if (!isInitializedForCurrentChain || !meeClient || !oNexus) {
        const queuedOperation: WalletPendingOperation = {
          operation,
          timestamp: Date.now(),
        };
        setPendingOperations((prev) => {
          const newOperations = { ...prev };
          newOperations[operationName] = queuedOperation;
          return newOperations;
        });

        console.warn('Queued operation:', operationName);

        return new Promise((resolve, reject) => {
          queuedOperation.resolve = resolve;
          queuedOperation.reject = reject;
        });
      }

      return operation(meeClient, oNexus, sendCallsExtraParams);
    },
    [isInitializedForCurrentChain, meeClient, oNexus, sendCallsExtraParams],
  );

  // Execute pending operations when clients are ready
  useEffect(() => {
    const executePendingOperations = async () => {
      console.warn(
        `Executing ${Object.keys(pendingOperations).length} pending operations`,
      );

      // Execute all pending operations
      for (const [operationName, pendingOperation] of Object.entries(
        pendingOperations,
      )) {
        console.warn(`Executing ${operationName}`, sendCallsExtraParams);

        try {
          const result = await pendingOperation.operation(
            meeClient!,
            oNexus!,
            sendCallsExtraParams,
          );
          pendingOperation.resolve?.(result);
        } catch (error) {
          pendingOperation.reject?.(error);
        }
      }

      // Clear the queue
      setPendingOperations({});
    };

    if (
      isInitializedForCurrentChain &&
      meeClient &&
      oNexus &&
      Object.keys(pendingOperations).length > 0
    ) {
      executePendingOperations();
    }
  }, [
    isInitializedForCurrentChain,
    pendingOperations,
    meeClient,
    oNexus,
    sendCallsExtraParams,
  ]);

  // Enhanced initialization with retry logic and better error handling
  useEffect(() => {
    if (!walletClient) {
      console.warn(
        'Wallet client is undefined, skipping MEE client initialization.',
      );
      return;
    }

    if (!chainId || !address) {
      console.warn('Missing chainId or address, skipping initialization');
      return;
    }

    if (isInitializedForCurrentChain) {
      console.warn('Clients already initialised for this chain');
      return;
    }

    // If chain or address changed, reset clients immediately
    if (
      lastInitRef.current.chainId !== chainId ||
      lastInitRef.current.address !== address
    ) {
      console.warn(
        'Chain or address changed, resetting clients',
        lastInitRef.current,
        chainId,
        address,
      );
      resetInProgressRef.current = true;
      initInProgressRef.current = false;
    }

    if (!resetInProgressRef.current && initInProgressRef.current) {
      console.warn('Already initializing, skipping...');
      return;
    }

    console.warn(
      'Starting client initialization for chain:',
      chainId,
      'address:',
      address,
    );

    // Find the current chain from viem/chains
    const currentChain = Object.values(chains).find(
      (chain) => chain.id === chainId,
    );
    const depositChain = Object.values(chains).find(
      (chain) => chain.id === projectData.chainId,
    );

    if (!currentChain || !depositChain) {
      console.error('Chain not found:', {
        currentChainId: chainId,
        depositChainId: projectData.chainId,
      });
      return;
    }

    const initMeeClient = async () => {
      try {
        resetInProgressRef.current = false;
        initInProgressRef.current = true;
        console.warn('Initializing oNexus with chains:', [
          currentChain.id,
          depositChain.id,
        ]);
        const oNexusInit = await toMultichainNexusAccount({
          signer: walletClient,
          // accountAddress: walletClient.account.address,
          chains: [currentChain, depositChain],
          transports: [http(), http()],
        });

        console.warn('Creating MEE client...');
        const meeClientInit = await createMeeClient({ account: oNexusInit });

        console.warn('Clients initialized successfully');
        setONexus(oNexusInit);
        setMeeClient(meeClientInit);
        lastInitRef.current = { chainId, address };
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
  ]);

  const wagmiConfig = useConfig();

  const handleGetCapabilities = useCallback(
    async (
      args: WalletCapabilitiesArgs,
      meeClientParam: MeeClient,
      oNexusParam: MultichainSmartAccount,
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
      sendCallsExtraParams: {
        chainId: number | undefined;
        currentRoute: Route | null;
        zapData: any;
        projectData: ProjectData;
        address: string | undefined;
      },
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

      const currentChainId = sendCallsExtraParams.chainId;
      const currentAddress = sendCallsExtraParams.address;
      const currentRouteFromToken = sendCallsExtraParams.currentRoute.fromToken;
      const currentRouteFromAmount =
        sendCallsExtraParams.currentRoute.fromAmount;
      const integrationData = sendCallsExtraParams.zapData;
      const depositAddress = integrationData.market?.address as EVMAddress;
      const depositToken = integrationData.market?.depositToken?.address;
      const depositTokenDecimals =
        integrationData.market?.depositToken.decimals;
      const depositChainId = sendCallsExtraParams.projectData.chainId;

      if (!depositChainId) {
        throw new Error('Deposit chain id is undefined.');
      }

      if (!depositAddress || !depositToken) {
        throw new Error('Deposit address or token is undefined.');
      }

      // @Note this works only for EVM chains
      const isNativeSourceToken = currentRouteFromToken.address === zeroAddress;

      console.warn('Using native source token:', isNativeSourceToken);

      if (isNativeSourceToken) {
        throw new Error('Native source token is not supported.');
      }

      // raw calldata from the widget
      const instructions = await Promise.all(
        calls.map(async (call: WalletCall) => {
          if (!call.to || !call.data) {
            throw new Error('Invalid call structure: Missing to or data field');
          }
          return oNexusParam.buildComposable({
            type: 'rawCalldata',
            data: {
              to: call.to,
              calldata: call.data,
              chainId: currentChainId,
            },
          });
        }),
      );

      // constraints
      const constraints = [
        greaterThanOrEqualTo(parseUnits('0.1', depositTokenDecimals)), // TODO: Remove hardcoded value
      ];

      // token approval
      const approveInstruction = await buildContractComposable(oNexusParam, {
        address: depositToken,
        chainId: depositChainId,
        abi: integrationData.abi.approve,
        functionName: integrationData.abi.approve.name,
        gasLimit: 100000n,
        args: [
          depositAddress,
          runtimeERC20BalanceOf({
            targetAddress: oNexusParam.addressOn(
              depositChainId,
              true,
            ) as EVMAddress,
            tokenAddress: depositToken,
            constraints,
          }),
        ],
      });
      instructions.push(approveInstruction);

      // Deposit instruction (dynamic ABI-driven args)
      const depositInputs = integrationData.abi.deposit.inputs;
      const depositArgs = depositInputs.map((input: AbiInput) => {
        if (input.type === 'uint256') {
          return runtimeERC20BalanceOf({
            targetAddress: oNexusParam.addressOn(
              depositChainId,
              true,
            ) as EVMAddress,
            tokenAddress: depositToken,
            constraints,
          });
        } else if (input.type === 'address') {
          // Use the user's EOA address or another relevant address
          return currentAddress;
        }
        throw new Error(`Unsupported deposit input type: ${input.type}`);
      });
      const depositInstruction = await buildContractComposable(oNexusParam, {
        address: depositAddress,
        chainId: depositChainId,
        abi: integrationData.abi.deposit,
        functionName: integrationData.abi.deposit.name,
        gasLimit: 1000000n,
        args: depositArgs,
      });
      instructions.push(depositInstruction);

      // Only add transferLpInstruction if deposit ABI does NOT have an address input
      const depositHasAddressArg = depositInputs.some(
        (input: AbiInput) => input.type === 'address',
      );

      if (!depositHasAddressArg) {
        if (!currentAddress) {
          throw new Error('User address (EOA) is not available.');
        }
        const transferLpInstruction = await buildContractComposable(
          oNexusParam,
          {
            address: depositAddress,
            chainId: depositChainId,
            abi: integrationData.abi.transfer,
            functionName: integrationData.abi.transfer.name,
            gasLimit: 200000n,
            args: [
              address,
              runtimeERC20BalanceOf({
                targetAddress: oNexusParam.addressOn(
                  depositChainId,
                  true,
                ) as EVMAddress,
                tokenAddress: depositAddress,
                constraints,
              }),
            ],
          },
        );
        instructions.push(transferLpInstruction);
      }

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
          return queueOperation(
            WalletMethods.getCapabilities,
            (meeClientParam, oNexusParam) =>
              handleGetCapabilities(args, meeClientParam, oNexusParam),
          );
        },
        getCallsStatus: async (_, args) => {
          console.warn('getCallsStatus');
          return queueOperation(
            WalletMethods.getCallsStatus,
            (meeClientParam, oNexusParam) =>
              handleWalletGetCallsStatus(args, meeClientParam, oNexusParam),
          );
        },
        sendCalls: async (_, args) => {
          console.warn('sendCalls');
          return queueOperation(
            WalletMethods.sendCalls,
            (meeClientParam, oNexusParam, extraParams) =>
              handleWalletSendCalls(
                args,
                meeClientParam,
                oNexusParam,
                extraParams!,
              ),
          );
        },
        waitForCallsStatus: async (_, args) => {
          console.warn('waitForCallsStatus');
          return queueOperation(
            WalletMethods.waitForCallsStatus,
            (meeClientParam, oNexusParam) =>
              handleWalletWaitForCallsStatus(args, meeClientParam, oNexusParam),
          );
        },
      }),
    ];
  }, [
    wagmiConfig,
    queueOperation,
    handleGetCapabilities,
    handleWalletGetCallsStatus,
    handleWalletSendCalls,
    handleWalletWaitForCallsStatus,
  ]);

  const toAddress = useMemo(
    () =>
      oNexus
        ? (oNexus.addressOn(projectData.chainId, true) as EVMAddress)
        : (address as EVMAddress) || '0x',
    [oNexus, address, projectData.chainId],
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
