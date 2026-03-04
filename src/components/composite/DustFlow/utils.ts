import type { PortfolioBalance, WalletToken } from '@/types/tokens';
import type { LiFiStep } from '@lifi/sdk';
import { ChainId } from '@lifi/sdk';
import type { Address, Hex } from 'viem';
import { encodeFunctionData, zeroAddress } from 'viem';
import { ERC20_ABI } from './constants';

export const getChainMinUsdThreshold = (chainId: number) => {
  if (chainId === ChainId.ETH) {
    return 0.5;
  }
  return 0.05;
};

export const checkBalanceWithinRange = (
  balance: PortfolioBalance<WalletToken>,
  maxUsd: number,
  minUsd: number,
): boolean => maxUsd >= balance.amountUSD && balance.amountUSD > minUsd;

export type BatchCall = {
  chainId: number;
  to: Address;
  data: Hex;
};

/**
 * Build approval call(s) for a single quote when using batch (EIP-5792).
 * Returns [] if no approval needed (native token, no approvalAddress, or skipApproval).
 */
export const buildApprovalCallsForQuote = (
  quote: LiFiStep,
  currentAllowance?: bigint,
): BatchCall[] => {
  const { action, estimate } = quote;
  const tokenAddress = action.fromToken.address as Address;
  const chainId = action.fromToken.chainId;
  const isNative = !tokenAddress || tokenAddress === zeroAddress;
  if (isNative || !estimate.approvalAddress || estimate.skipApproval) {
    return [];
  }

  const spender = estimate.approvalAddress as Address;
  const fromAmount = BigInt(action.fromAmount);

  if (currentAllowance !== undefined && fromAmount <= currentAllowance) {
    return [];
  }

  const calls: BatchCall[] = [];

  const shouldReset =
    estimate.approvalReset &&
    (currentAllowance === undefined || currentAllowance > 0n);
  if (shouldReset) {
    calls.push({
      chainId,
      to: tokenAddress,
      data: encodeFunctionData({
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [spender, 0n],
      }),
    });
  }

  calls.push({
    chainId,
    to: tokenAddress,
    data: encodeFunctionData({
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [spender, fromAmount],
    }),
  });

  return calls;
};
