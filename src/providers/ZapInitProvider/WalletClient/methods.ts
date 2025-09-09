import {
  BaseGetSupertransactionReceiptPayload,
  getMeeScanLink,
  MeeClient,
  MeeFilledUserOpDetails,
  MultichainSmartAccount,
  UserOpStatus,
  WaitForSupertransactionReceiptPayload,
} from '@biconomy/abstractjs';
import {
  WalletCall,
  GetCapabilitiesArgs,
  GetCallsStatusArgs,
  WalletMethodsRef,
  SendCallsArgs,
  WaitCallsStatusArgs,
} from '../types';
import {
  buildContractInstructions,
  SendCallsExtraParams,
} from '../ModularZaps';
import { getTokenBalance } from '@lifi/sdk';
import { Hex, TransactionReceipt, zeroAddress } from 'viem';
import { isSameToken } from '../utils';
import { findChain } from 'src/utils/chains/findChain';
import { executeQuoteStrategy } from './quotes';
import { minutesToMilliseconds } from 'date-fns';
import { TIMEOUT_IN_MINUTES } from '../constants';
import { retryWithTimeout } from 'src/utils/retryWithTimeout';
import { RetryStoppedError } from 'src/utils/errors';

type ExtendedTransactionReceipt = Partial<TransactionReceipt> &
  Pick<TransactionReceipt, 'status' | 'transactionHash'> & {
    transactionLink?: string;
  };

const BICONOMY_TRANSACTION_HASH_SUFFIX = '_biconomy';

const hasPendingStatus = (status: string) => status === 'PENDING';

const hasFailedStatus = (status: string) =>
  ['FAILED', 'MINED_FAIL'].includes(status);

const getFormattedTransactionHash = (hash: string) =>
  hash.includes(BICONOMY_TRANSACTION_HASH_SUFFIX)
    ? (hash as Hex)
    : (`${hash}${BICONOMY_TRANSACTION_HASH_SUFFIX}` as Hex);

// Helper function used for both getCallsStatus and waitForCallsStatus
const processTransactionReceipt = (
  receipt: WaitForSupertransactionReceiptPayload | null,
  hash: Hex,
  extraParams: SendCallsExtraParams,
  hasFailedNonCleanUpUserOps?: boolean,
) => {
  if (!receipt) {
    if (hasFailedNonCleanUpUserOps) {
      return {
        atomic: true,
        id: getFormattedTransactionHash(hash),
        status: 'failure',
        statusCode: 400,
        receipts: [
          {
            transactionHash: getFormattedTransactionHash(hash),
            transactionLink: getMeeScanLink(hash),
            status: 'reverted' as const,
          },
        ],
      };
    }

    return {
      atomic: true,
      id: getFormattedTransactionHash(hash),
      status: 'success',
      statusCode: 200,
      receipts: [
        {
          transactionHash: getFormattedTransactionHash(hash),
          transactionLink: getMeeScanLink(hash),
          status: 'success' as const,
        },
      ],
    };
  }

  const originalReceipts: ExtendedTransactionReceipt[] =
    receipt?.receipts || [];

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
      `${fromChainBlockExplorerUrl}/tx/${originalReceipts[1].transactionHash}`;
  }

  // Ensure the last receipt has the correct transactionHash format
  if (originalReceipts.length > 0) {
    originalReceipts[originalReceipts.length - 1].transactionHash =
      getFormattedTransactionHash(hash);
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

  const currentChainId = sendCallsExtraParams.currentRoute.fromChainId;
  const currentAddress = sendCallsExtraParams.currentRoute.fromAddress;
  const currentRouteFromToken = sendCallsExtraParams.currentRoute.fromToken;
  const currentRouteFromAmount = sendCallsExtraParams.currentRoute.fromAmount;
  const currentRouteFromAmountFormatted = BigInt(currentRouteFromAmount);
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
  const rawInstructionsPromises = Promise.all(
    baseCalls.map(async (call: WalletCall) => {
      if (!call.to || !call.data) {
        throw new Error('Invalid call structure: Missing to or data field');
      }
      const data = {
        to: call.to,
        calldata: call.data,
        chainId: call.chainId ?? currentChainId,
        value: isNativeSourceToken
          ? currentRouteFromAmountFormatted
          : undefined,
      };
      return oNexusParam.buildComposable({
        type: 'rawCalldata',
        data,
      });
    }),
  );

  const [rawInstructions, contractInstructions, currentTokenBalance] =
    await Promise.all([
      rawInstructionsPromises,
      // Build project-specific contract instructions (approve, deposit, transfer)
      buildContractInstructions(oNexusParam, sendCallsExtraParams),
      // Get current token balance
      getTokenBalance(currentAddress, currentRouteFromToken),
    ]);

  // Combine all instructions
  const instructions = [...rawInstructions, ...contractInstructions];

  const userBalance = BigInt(currentTokenBalance?.amount ?? 0);
  const requestedAmount = currentRouteFromAmountFormatted;

  const cleanUps = [];

  // Add source token cleanup (only if not same token deposit)
  if (!isSameTokenDeposit) {
    const sourceTokenCleanup: {
      tokenAddress: Hex;
      chainId: number;
      recipientAddress: Hex;
      amount?: bigint;
    } = {
      tokenAddress: currentRouteFromToken.address as Hex,
      chainId: currentChainId,
      recipientAddress: currentAddress as Hex,
    };

    if (isNativeSourceToken) {
      sourceTokenCleanup.amount = currentRouteFromAmountFormatted;
    }

    cleanUps.push(sourceTokenCleanup);
  }

  // Add deposit token cleanup
  cleanUps.push({
    tokenAddress: depositToken,
    chainId: depositChainId,
    recipientAddress: currentAddress as Hex,
  });

  const hash = await executeQuoteStrategy({
    meeClientParam,
    oNexusParam,
    currentChainId,
    depositChainId,
    currentRouteFromToken,
    currentRouteFromAmount,
    cleanUps,
    instructions,
    userBalance,
    requestedAmount,
    isEmbeddedWallet: sendCallsExtraParams.isEmbeddedWallet,
    eoaWallet: currentAddress as Hex,
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
  ) as Hex;

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
      originalHash,
      extraParams,
    );
  } catch (error) {
    console.error('🔍 getCallsStatus error for hash', originalHash, error);

    return processTransactionReceipt(null, originalHash, extraParams);
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

  const { id } = args;
  const timeout = minutesToMilliseconds(TIMEOUT_IN_MINUTES);
  const originalId = id.replace(BICONOMY_TRANSACTION_HASH_SUFFIX, '') as Hex;

  let nonCleanUpUserOps: (MeeFilledUserOpDetails & UserOpStatus)[] = [];

  try {
    const receipt = await meeClientParam.waitForSupertransactionReceipt({
      hash: originalId,
    });
    return processTransactionReceipt(receipt, originalId, extraParams);
  } catch (error) {
    console.error('🔍 waitForSupertransactionReceipt failed:', error);

    try {
      await retryWithTimeout(async () => {
        // Check explorer status to see if we should retry
        const explorerResponse =
          await meeClientParam.request<BaseGetSupertransactionReceiptPayload>({
            path: `explorer/${originalId}`,
            method: 'GET',
          });

        nonCleanUpUserOps = explorerResponse.userOps.filter(
          (userOp) => !userOp.isCleanUpUserOp,
        );

        const hasPendingNonCleanUpUserOps = nonCleanUpUserOps.some((userOp) =>
          hasPendingStatus(userOp.executionStatus),
        );

        // @Note: if waitForSupertransactionReceipt fails, but the main transactions are still processing, we should retry
        if (hasPendingNonCleanUpUserOps) {
          throw new Error('Transaction still processing, retrying...');
        }

        throw new RetryStoppedError(
          'Transaction has final status, no retry needed',
        );
      }, timeout);
    } catch (explorerError) {
      console.error('🔍 Explorer check failed:', explorerError);
      // Continue retrying even if explorer check fails
    }
  }

  const hasFailedNonCleanUpUserOps = nonCleanUpUserOps
    ?.slice(0, 2)
    .some((userOp) => hasFailedStatus(userOp.executionStatus));

  return processTransactionReceipt(
    null,
    originalId,
    extraParams,
    hasFailedNonCleanUpUserOps,
  );
};

export const walletMethods: WalletMethodsRef = {
  wallet_getCapabilities: getCapabilities,
  wallet_getCallsStatus: getCallsStatus,
  wallet_sendCalls: sendCalls,
  wallet_waitForCallsStatus: waitForCallsStatus,
};
