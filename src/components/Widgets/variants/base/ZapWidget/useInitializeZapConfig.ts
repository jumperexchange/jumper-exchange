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
import { useZaps } from 'src/hooks/useZaps';
import { createCustomEVMProvider } from 'src/providers/WalletProvider/createCustomEVMProvider';
import { http, parseUnits } from 'viem';
import { mainnet, optimism, base } from 'viem/chains';
import { useReadContracts, useWalletClient, useConfig } from 'wagmi';
import { useAccount } from '@lifi/wallet-management';
import {
  WalletCapabilitiesArgs,
  WalletGetCallsStatusArgs,
  WalletWaitForCallsStatusArgs,
  WalletSendCallsArgs,
  WalletCall,
  AbiInput,
} from './types';
import { getTokenBalance, Route } from '@lifi/sdk';
import { ProjectData } from 'src/types/questDetails';
import { useEnhancedZapData } from 'src/hooks/zaps/useEnhancedZapData';

export const useInitializeZapConfig = (projectData: ProjectData) => {
  const [oNexus, setONexus] = useState<MultichainSmartAccount | null>(null);
  const [meeClient, setMeeClient] = useState<MeeClient | null>(null);
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
  const [areClientInitializing, setAreClientInitializing] = useState(false);

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
    account: address as `0x${string}`,
    query: {
      enabled: !!chainId && !!address,
    },
  });

  // Enhanced initialization with retry logic and better error handling
  useEffect(() => {
    const initMeeClient = async () => {
      if (!chainId) {
        console.warn('Chain is undefined, skipping MEE client initialization.');
        return;
      }

      if (!walletClient) {
        console.warn(
          'Wallet client is undefined, skipping MEE client initialization.',
        );
        return;
      }

      if (areClientInitializing) {
        console.warn('Init MEE client.');
        return;
      }

      if (!areClientInitializing && (!oNexus || !meeClient)) {
        setAreClientInitializing(true);
      }

      // create multichain nexus account
      // Creates the Biconomy "Multichain Nexus Account", a smart contract account
      // that orchestrates actions across multiple chains.
      // See: https://docs.biconomy.io/multichain-orchestration/comprehensive#multichain-nexus-account
      const oNexusInit = await toMultichainNexusAccount({
        signer: walletClient,
        chains: [mainnet, optimism, base],
        transports: [http(), http(), http()],
      });

      // create mee client
      // Initializes the Biconomy "MEE (Modular Execution Environment) Client".
      // This client interacts with Biconomy's backend to manage the orchestration.
      // See: https://docs.biconomy.io/multichain-orchestration/comprehensive#modular-execution-environment-mee
      const meeClientInit = await createMeeClient({
        account: oNexusInit,
      });

      console.log('MEE client initialized successfully', meeClientInit);

      setONexus(oNexusInit);
      setMeeClient(meeClientInit);
      setAreClientInitializing(false);
    };
    initMeeClient();
  }, [chainId, walletClient]);

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
    // @TODO do we need this?
    // [baseWidgetConfig],
    [],
  );

  // Helper function to handle 'wallet_getCallsStatus'
  const handleWalletGetCallsStatus = useCallback(
    async (args: WalletGetCallsStatusArgs) => {
      if (!meeClient) {
        // oNexus is not directly used here but its initialization is tied to meeClient
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

      const receipt = (await meeClient.waitForSupertransactionReceipt({
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
    [meeClient],
  );

  // Helper function to handle 'wallet_waitForCallsStatus'
  const handleWalletWaitForCallsStatus = useCallback(
    async (args: WalletWaitForCallsStatusArgs) => {
      if (!meeClient) {
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
    [meeClient],
  );

  // @TODO split this function into smaller units
  // Helper function to handle 'wallet_sendCalls'
  const handleWalletSendCalls = useCallback(
    async (args: WalletSendCallsArgs) => {
      if (!meeClient || !oNexus) {
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

      if (!chainId) {
        throw new Error('Cannot determine current chain ID from wallet.');
      }
      const currentChainId = chainId;

      if (!currentRoute) {
        throw new Error('Cannot process transaction: Route is undefined.');
      }
      if (!zapData) {
        throw new Error('Integration data is not available.');
      }

      if (!address) {
        throw new Error('No wallet address available.');
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
          return oNexus.buildComposable({
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
      const approveInstruction = await buildContractComposable(oNexus, {
        address: depositToken,
        chainId: depositChainId,
        abi: integrationData.abi.approve,
        functionName: integrationData.abi.approve.name,
        gasLimit: 100000n,
        args: [
          depositAddress,
          runtimeERC20BalanceOf({
            targetAddress: oNexus.addressOn(
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
            targetAddress: oNexus.addressOn(
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
      const depositInstruction = await buildContractComposable(oNexus, {
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
        const transferLpInstruction = await buildContractComposable(oNexus, {
          address: depositAddress,
          chainId: depositChainId,
          abi: integrationData.abi.transfer,
          functionName: integrationData.abi.transfer.name,
          gasLimit: 200000n,
          args: [
            address,
            runtimeERC20BalanceOf({
              targetAddress: oNexus.addressOn(
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

      const currentTokenBalance = await getTokenBalance(
        address,
        currentRoute.fromToken,
      );

      const userBalance = BigInt(currentTokenBalance?.amount ?? 0);
      console.log(`userBalance`, userBalance);
      const requestedAmount = BigInt(currentRoute.fromAmount);

      const fusionQuoteParams: GetFusionQuoteParams = {
        trigger: {
          tokenAddress: currentRoute.fromToken.address as `0x${string}`,
          amount: requestedAmount,
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
      };

      // Calculate the percentage of the balance the user wants to use (in basis points)
      const usageInBasisPoints =
        userBalance > 0n ? (requestedAmount * 10_000n) / userBalance : 0n;

      // If the user is using ≥ 99.90% of their balance, we assume they intend to use max
      const isUsingMax = usageInBasisPoints >= 9_990n;

      console.log('usageInBasisPoints', usageInBasisPoints);

      if (isUsingMax) {
        fusionQuoteParams.trigger.useMaxAvailableFunds = true;
      }

      const quote = await meeClient.getFusionQuote(fusionQuoteParams);

      console.log('quote', quote);

      const { hash } = await meeClient.executeFusionQuote({
        fusionQuote: quote,
      });

      return { id: hash };
    },
    [meeClient, oNexus, chainId, currentRoute, zapData, projectData, address],
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

  // Check if oNexus and meeClient are initialized before rendering
  const isInitialized = oNexus && meeClient;

  return {
    isInitialized,
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
};
