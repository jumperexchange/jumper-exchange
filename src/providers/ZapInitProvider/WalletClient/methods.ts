import {
  getChain,
  GetFusionQuoteParams,
  GetSupertransactionReceiptPayload,
  MeeClient,
  MultichainSmartAccount,
  WaitForSupertransactionReceiptPayload,
} from '@biconomy/abstractjs';
import {
  WalletCall,
  GetCapabilitiesArgs,
  GetCallsStatusArgs,
  WalletMethod,
  WalletMethodsRef,
  SendCallsArgs,
  WaitCallsStatusArgs,
  GetCallsStatusResponse,
} from '../types';
import {
  buildContractInstructions,
  SendCallsExtraParams,
} from '../ModularZaps';
import { getTokenBalance } from '@lifi/sdk';
import { EVMAddress } from 'src/types/internal';
import { TransactionReceipt, WalletCallReceipt, zeroAddress } from 'viem';
import { isSameToken } from '../utils';
import {
  BICONOMY_EXPLORER_TX_PATH,
  BICONOMY_EXPLORER_URL,
} from 'src/components/Widgets/variants/widgetConfig/base/useZapRPC';
import { findChain } from 'src/utils/chains/findChain';

type ExtendedTransactionReceipt = Partial<TransactionReceipt> &
  Pick<TransactionReceipt, 'status' | 'transactionHash'> & {
    transactionLink?: string;
  };

const BICONOMY_TRANSACTION_HASH_SUFFIX = '_biconomy';

const getFormattedTransactionHash = (hash: string) =>
  `${hash}${BICONOMY_TRANSACTION_HASH_SUFFIX}` as EVMAddress;

// Helper function used for both getCallsStatus and waitForCallsStatus
const processTransactionReceipt = (
  receipt: WaitForSupertransactionReceiptPayload | null,
  hash: string,
  extraParams: SendCallsExtraParams,
  isError: boolean = false,
) => {
  if (isError || !receipt) {
    // Fallback receipt for errors/timeouts
    return {
      atomic: true,
      id: getFormattedTransactionHash(hash),
      status: 'failed',
      statusCode: 400,
      receipts: [
        {
          transactionHash: getFormattedTransactionHash(hash),
          transactionLink: `${BICONOMY_EXPLORER_URL}/${BICONOMY_EXPLORER_TX_PATH}/${hash}`,
          status: 'reverted',
        } as ExtendedTransactionReceipt,
      ],
    };
  }

  const originalReceipts: ExtendedTransactionReceipt[] =
    receipt?.receipts || [];

  // Ensure the last receipt has the correct transactionHash format
  if (originalReceipts.length > 0) {
    originalReceipts[originalReceipts.length - 1].transactionHash =
      getFormattedTransactionHash(hash);
  }

  // Add transaction links and chain info
  let fromChain;
  let fromChainBlockExplorerUrl;
  if (extraParams.currentRoute?.fromChainId) {
    fromChain = findChain(extraParams.currentRoute?.fromChainId);
  }

  if (fromChain) {
    fromChainBlockExplorerUrl = fromChain.blockExplorers?.default.url;
  }

  if (fromChainBlockExplorerUrl && originalReceipts.length > 0) {
    (originalReceipts[originalReceipts.length - 1] as any).transactionLink =
      `${fromChainBlockExplorerUrl}/tx/${originalReceipts[0].transactionHash}`;
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
    id: getFormattedTransactionHash(hash),
    status: isSuccess ? 'success' : 'failed',
    statusCode,
    receipts: originalReceipts.map((receipt) => ({
      transactionHash: receipt.transactionHash,
      transactionLink: (receipt as any).transactionLink,
      status: receipt.status || (isSuccess ? 'success' : 'reverted'),
    })),
  };
};

// Helper function to handle 'wallet_getCapabilities'
export const getCapabilities = async (
  args: GetCapabilitiesArgs,
  meeClientParam: MeeClient | undefined,
  oNexusParam: MultichainSmartAccount | undefined,
  extraParams: SendCallsExtraParams,
): Promise<{
  atomic: { status: 'supported' | 'ready' | 'unsupported' };
}> => {
  return Promise.resolve({
    atomic: { status: 'supported' },
  });
};

// @TODO split this function into smaller units
// Helper function to handle 'wallet_sendCalls'
export const sendCalls = async (
  args: SendCallsArgs,
  meeClientParam: MeeClient | undefined,
  oNexusParam: MultichainSmartAccount | undefined,
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
  if (!sendCallsExtraParams.currentRoute) {
    throw new Error('Cannot process transaction: Route is undefined.');
  }
  if (!sendCallsExtraParams.currentRoute.fromAddress) {
    throw new Error('No wallet address available.');
  }
  if (!sendCallsExtraParams.currentRoute.fromChainId) {
    throw new Error('Cannot determine current chain ID from wallet.');
  }
  if (!sendCallsExtraParams.zapData) {
    throw new Error('Integration data is not available.');
  }

  console.warn(
    'sendCallsExtraParams.currentRoute',
    sendCallsExtraParams.currentRoute,
  );

  const currentChainId = sendCallsExtraParams.currentRoute.fromChainId;
  const currentAddress = sendCallsExtraParams.currentRoute.fromAddress;
  const currentRouteFromToken = sendCallsExtraParams.currentRoute.fromToken;
  const currentRouteFromAmount = sendCallsExtraParams.currentRoute.fromAmount;
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

  console.warn('currentRouteFromToken', currentRouteFromToken);

  const isSameTokenDeposit = isSameToken(
    sendCallsExtraParams.currentRoute.fromToken,
    sendCallsExtraParams.currentRoute.toToken,
  );

  console.warn('isSameTokenDeposit', isSameTokenDeposit);

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
      };
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

  const cleanUps = [
    {
      tokenAddress: depositToken,
      chainId: depositChainId,
      recipientAddress: currentAddress as EVMAddress,
    },
  ];

  if (!isSameTokenDeposit) {
    cleanUps.unshift({
      tokenAddress: currentRouteFromToken.address as EVMAddress,
      chainId: currentChainId,
      recipientAddress: currentAddress as EVMAddress,
    });
  }

  const fusionQuoteParams: GetFusionQuoteParams = {
    trigger: {
      tokenAddress: currentRouteFromToken.address as EVMAddress,
      amount: requestedAmount,
      chainId: currentChainId,
    },
    cleanUps,
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

  console.warn('🔍 sendCalls response', {
    id: getFormattedTransactionHash(hash),
  });

  return { id: getFormattedTransactionHash(hash) };
};

// Helper function to handle 'wallet_getCallsStatus'
export const getCallsStatus = async (
  args: GetCallsStatusArgs,
  meeClientParam: MeeClient | undefined,
  oNexusParam: MultichainSmartAccount | undefined,
  extraParams: SendCallsExtraParams,
) => {
  if (!meeClientParam) {
    throw new Error('MEE client not initialized');
  }
  if (!args.params || !Array.isArray(args.params)) {
    throw new Error('Invalid args.params structure for wallet_getCallsStatus');
  }
  const hash = args.params[0];
  if (typeof hash !== 'string' || !hash) {
    throw new Error('Missing or invalid hash in params object');
  }

  const originalHash = hash.replace(
    BICONOMY_TRANSACTION_HASH_SUFFIX,
    '',
  ) as EVMAddress;

  try {
    const receipt = await meeClientParam.getSupertransactionReceipt({
      hash: originalHash,
    });

    if (!receipt) {
      throw new Error('Transaction not found or still pending');
    }

    return processTransactionReceipt(
      {
        ...receipt,
        receipts: receipt.receipts || [],
      },
      hash,
      extraParams,
    );
  } catch (error) {
    console.error('🔍 getCallsStatus error for hash', hash, error);

    return processTransactionReceipt(null, hash, extraParams, true);
  }
};

// Helper function to handle 'wallet_waitForCallsStatus'
export const waitForCallsStatus = async (
  args: WaitCallsStatusArgs,
  meeClientParam: MeeClient | undefined,
  oNexusParam: MultichainSmartAccount | undefined,
  extraParams: SendCallsExtraParams,
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

  const originalId = id.replace(
    BICONOMY_TRANSACTION_HASH_SUFFIX,
    '',
  ) as EVMAddress;

  try {
    // waitForSupertransactionReceipt already waits for completion, so we don't need to poll
    // We'll use the timeout to set a maximum wait time
    const receipt = (await Promise.race([
      meeClientParam!.waitForSupertransactionReceipt({
        hash: originalId,
      }),
      new Promise((_, reject) =>
        setTimeout(
          () =>
            reject(
              new Error(
                `Timed out while waiting for call bundle with id "${originalId}" to be confirmed.`,
              ),
            ),
          timeout,
        ),
      ),
    ])) as WaitForSupertransactionReceiptPayload;

    return processTransactionReceipt(receipt, id, extraParams);
  } catch (error) {
    console.error('🔍 waitForCallsStatus error for id', id, error);
    return processTransactionReceipt(null, id, extraParams, true);
  }
};

export const walletMethods: WalletMethodsRef = {
  wallet_getCapabilities: getCapabilities,
  wallet_getCallsStatus: getCallsStatus,
  wallet_sendCalls: sendCalls,
  wallet_waitForCallsStatus: waitForCallsStatus,
};
