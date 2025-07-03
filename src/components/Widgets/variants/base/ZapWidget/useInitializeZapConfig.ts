import {
  MultichainSmartAccount,
  MeeClient,
  toMultichainNexusAccount,
  createMeeClient,
  WaitForSupertransactionReceiptPayload,
  greaterThanOrEqualTo,
  runtimeERC20BalanceOf,
} from '@biconomy/abstractjs';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { buildContractComposable } from './utils';
import { useZaps } from 'src/hooks/useZaps';
import { createCustomEVMProvider } from 'src/providers/WalletProvider/createCustomEVMProvider';
import { createWalletClient, custom, http, parseUnits } from 'viem';
import { mainnet, optimism, base } from 'viem/chains';
import { useAccount, useReadContracts, useConfig } from 'wagmi';
import {
  ProjectData,
  WalletCapabilitiesArgs,
  WalletGetCallsStatusArgs,
  WalletWaitForCallsStatusArgs,
  WalletSendCallsArgs,
  WalletCall,
  AbiInput,
} from './ZapWidget.types';
import { Route } from '@lifi/sdk';

export const useInitializeZapConfig = (projectData: ProjectData) => {
  const [oNexus, setONexus] = useState<MultichainSmartAccount | null>(null);
  const [meeClient, setMeeClient] = useState<MeeClient | null>(null);
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);

  const [isInitializing, setIsInitializing] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(
    null,
  );

  const account = useAccount();
  const { address, chain } = account;
  const { data, isSuccess } = useZaps(projectData);
  const zapData = data?.data;

  const contractsConfig = useMemo(() => {
    return [
      {
        address: projectData.address as `0x${string}`,
        abi: [
          {
            inputs: [{ name: 'owner', type: 'address' }],
            name: 'balanceOf',
            outputs: [{ name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
        ] as const,
        functionName: 'balanceOf',
        args: [account.address as `0x${string}`],
      },
      {
        abi: [
          {
            inputs: [],
            name: 'decimals',
            outputs: [{ name: '', type: 'uint8' }],
            stateMutability: 'view',
            type: 'function',
          },
        ] as const,
        address: (projectData.tokenAddress ||
          projectData.address) as `0x${string}`,
        chainId: projectData.chainId,
        functionName: 'decimals',
      },
    ];
  }, [
    projectData.address,
    projectData.tokenAddress,
    projectData.chainId,
    account.address,
  ]);

  const {
    data: [
      { result: depositTokenData } = {},
      { result: depositTokenDecimals } = {},
    ] = [],
    isLoading: isLoadingDepositTokenData,
    refetch,
  } = useReadContracts({
    contracts: contractsConfig,
  });

  // Enhanced initialization with retry logic and better error handling
  const initializeMeeClient = useCallback(async () => {
    if (!chain) {
      console.warn('Chain is undefined, skipping MEE client initialization.');
      setInitializationError('Chain is not available');
      return;
    }

    if (isInitializing) {
      console.log('Initialization already in progress, skipping...');
      return;
    }

    setIsInitializing(true);
    setInitializationError(null);

    try {
      console.log('Starting MEE client initialization...');
      console.log('Chain:', chain);
      console.log('Ethereum provider available:', !!global?.window?.ethereum);

      // Check if ethereum provider is available
      if (!global?.window?.ethereum) {
        throw new Error(
          'Ethereum provider not available. Please ensure MetaMask or another wallet is installed and connected.',
        );
      }

      // create multichain nexus account
      // Creates the Biconomy "Multichain Nexus Account", a smart contract account
      // that orchestrates actions across multiple chains.
      // See: https://docs.biconomy.io/multichain-orchestration/comprehensive#multichain-nexus-account
      console.log('Creating multichain nexus account...');
      const oNexusInit = await toMultichainNexusAccount({
        signer: createWalletClient({
          chain,
          account: address as `0x${string}`,
          transport: custom(global.window.ethereum),
        }),
        chains: [mainnet, optimism, base],
        transports: [http(), http(), http()],
      });

      console.log('oNexus initialized successfully');

      // create mee client
      // Initializes the Biconomy "MEE (Modular Execution Environment) Client".
      // This client interacts with Biconomy's backend to manage the orchestration.
      // See: https://docs.biconomy.io/multichain-orchestration/comprehensive#modular-execution-environment-mee
      console.log('Creating MEE client...');
      const meeClientInit = await createMeeClient({
        account: oNexusInit,
      });

      console.log('MEE client initialized successfully');

      setONexus(oNexusInit);
      setMeeClient(meeClientInit);
      setInitializationError(null);
      console.log('Both oNexus and MEE client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize MEE client or oNexus:', error);
      console.error('Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      setInitializationError(
        error instanceof Error ? error.message : 'Initialization failed',
      );
      setONexus(null);
      setMeeClient(null);
    } finally {
      setIsInitializing(false);
    }
  }, [chain, isInitializing, address]);

  // Single initialization effect - only run when chain changes
  useEffect(() => {
    if (chain && address) {
      console.log('Chain and address detected, initializing MEE client...');
      initializeMeeClient();
    }
  }, [chain, address]); // Only depend on chain and address, not the function

  // Check if both clients are ready
  const areClientsReady = useMemo(() => {
    return !isInitializing && !initializationError && meeClient && oNexus;
  }, [isInitializing, initializationError, meeClient, oNexus]);

  const wagmiConfig = useConfig();

  const handleGetCapabilities = useCallback(
    async (
      args: WalletCapabilitiesArgs,
    ): Promise<{
      atomic: { status: 'supported' | 'ready' | 'unsupported' };
    }> => {
      return Promise.resolve({
        atomic: { status: 'supported' },
      });
    },
    // [baseWidgetConfig],
    [],
  );

  // Helper function to handle 'wallet_getCallsStatus'
  const handleWalletGetCallsStatus = useCallback(
    async (args: WalletGetCallsStatusArgs) => {
      if (!areClientsReady) {
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

      const receipt = (await meeClient!.waitForSupertransactionReceipt({
        hash: hash as `0x${string}`,
      })) as WaitForSupertransactionReceiptPayload;

      const originalReceipts = receipt?.receipts || [];
      // Ensure the last receipt has the correct transactionHash format
      if (originalReceipts.length > 0) {
        originalReceipts[originalReceipts.length - 1].transactionHash =
          `biconomy:${hash}` as `0x${string}`;
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
    [areClientsReady, meeClient],
  );

  // Helper function to handle 'wallet_waitForCallsStatus'
  const handleWalletWaitForCallsStatus = useCallback(
    async (args: WalletWaitForCallsStatusArgs) => {
      if (!areClientsReady) {
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
        meeClient!.waitForSupertransactionReceipt({
          hash: id as `0x${string}`,
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
          `biconomy:${id}` as `0x${string}`;
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
    [areClientsReady, meeClient],
  );

  // Helper function to handle 'wallet_sendCalls'
  const handleWalletSendCalls = useCallback(
    async (args: WalletSendCallsArgs) => {
      // Wait for clients to be ready before proceeding
      if (!areClientsReady) {
        if (isInitializing) {
          throw new Error(
            'MEE client and oNexus are still initializing. Please wait a moment and try again.',
          );
        }
        if (initializationError) {
          throw new Error(
            `Initialization failed: ${initializationError}. Please refresh the page and try again.`,
          );
        }
        throw new Error(
          'MEE client or oNexus not initialized. Please ensure wallet is connected and try again.',
        );
      }

      // At this point, we know both meeClient and oNexus are not null
      const client = meeClient!;
      const nexus = oNexus!;

      // Handle the new args structure with account and calls directly
      if (!args.account || !args.calls) {
        throw new Error('Invalid args structure: Missing account or calls');
      }

      const { calls } = args;
      if (calls.length === 0) {
        throw new Error("'calls' array is empty");
      }

      if (!chain) {
        throw new Error('Cannot determine current chain ID from wallet.');
      }
      const currentChainId = chain.id;

      if (!currentRoute) {
        throw new Error('Cannot process transaction: Route is undefined.');
      }
      if (!zapData) {
        throw new Error('Integration data is not available.');
      }

      const integrationData = zapData;
      const depositAddress = integrationData.market?.address as `0x${string}`;
      const depositToken = integrationData.market?.depositToken?.address;
      const depositChainId = projectData.chainId;

      if (!depositAddress || !depositToken) {
        throw new Error('Deposit address or token is undefined.');
      }

      // raw calldata from the widget
      const instructions = await Promise.all(
        calls.map(async (call: WalletCall) => {
          if (!call.to || !call.data) {
            throw new Error('Invalid call structure: Missing to or data field');
          }
          return nexus.buildComposable({
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
      const depositTokenDecimals = zapData.market?.depositToken.decimals;
      const constraints = [
        greaterThanOrEqualTo(parseUnits('0.1', depositTokenDecimals)), // TODO: Remove hardcoded value
      ];

      // token approval
      const approveInstruction = await buildContractComposable(nexus, {
        address: depositToken,
        chainId: depositChainId,
        abi: integrationData.abi.approve,
        functionName: integrationData.abi.approve.name,
        gasLimit: 100000n,
        args: [
          depositAddress,
          runtimeERC20BalanceOf({
            targetAddress: nexus.addressOn(
              depositChainId,
              true,
            ) as `0x${string}`,
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
            targetAddress: nexus.addressOn(
              depositChainId,
              true,
            ) as `0x${string}`,
            tokenAddress: depositToken,
            constraints,
          });
        } else if (input.type === 'address') {
          // Use the user's EOA address or another relevant address
          return address;
        }
        throw new Error(`Unsupported deposit input type: ${input.type}`);
      });
      const depositInstruction = await buildContractComposable(nexus, {
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
        if (!address) {
          throw new Error('User address (EOA) is not available.');
        }
        const transferLpInstruction = await buildContractComposable(nexus, {
          address: depositAddress,
          chainId: depositChainId,
          abi: integrationData.abi.transfer,
          functionName: integrationData.abi.transfer.name,
          gasLimit: 200000n,
          args: [
            address,
            runtimeERC20BalanceOf({
              targetAddress: nexus.addressOn(
                depositChainId,
                true,
              ) as `0x${string}`,
              tokenAddress: depositAddress,
              constraints,
            }),
          ],
        });
        instructions.push(transferLpInstruction);
      }

      const quote = await client.getFusionQuote({
        trigger: {
          tokenAddress: currentRoute.fromToken.address as `0x${string}`,
          amount: BigInt(currentRoute.fromAmount),
          chainId: currentChainId,
        },
        cleanUps: [
          {
            tokenAddress: depositToken,
            chainId: depositChainId,
            recipientAddress: account.address as `0x${string}`,
          },
        ],
        feeToken: {
          address: currentRoute.fromToken.address as `0x${string}`,
          chainId: currentChainId,
        },
        instructions,
      });

      const { hash } = await meeClient!.executeFusionQuote({
        fusionQuote: quote,
      });

      return { id: hash };
    },
    [
      areClientsReady,
      isInitializing,
      initializationError,
      meeClient,
      oNexus,
      chain,
      currentRoute,
      zapData,
      projectData,
      address,
    ],
  );

  const providers = useMemo(() => {
    return [
      createCustomEVMProvider({
        wagmiConfig,
        getCapabilities: async (_, args) => handleGetCapabilities(args),
        getCallsStatus: async (_, args) => handleWalletGetCallsStatus(args),
        sendCalls: async (_, args) => handleWalletSendCalls(args),
        waitForCallsStatus: async (_, args) =>
          handleWalletWaitForCallsStatus(args),
      }),
    ];
  }, [
    wagmiConfig,
    handleGetCapabilities,
    handleWalletGetCallsStatus,
    handleWalletSendCalls,
    handleWalletWaitForCallsStatus,
  ]);

  const toAddress = useMemo(
    () =>
      oNexus
        ? (oNexus.addressOn(projectData.chainId, true) as `0x${string}`)
        : (address as `0x${string}`) || '0x',
    [oNexus, address, projectData.chainId],
  );

  return {
    providers,
    toAddress,
    zapData,
    isZapDataSuccess: isSuccess,
    setCurrentRoute,
    depositTokenData,
    depositTokenDecimals,
    refetchDepositToken: refetch,
  };
};
