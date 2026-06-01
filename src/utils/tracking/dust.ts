import type { Hex } from 'viem';
import type { ComposeResponseData } from '@/app/lib/lifi-composer-client';
import type { DustSummaryValue } from '@/components/composite/DustFlow/types';
import { TrackingEventParameter } from '@/const/trackingKeys';
import type { TrackTransactionDataProps } from '@/types/userTracking';
import type { usePortfolioFormatters } from '@/hooks/tokens/usePortfolioFormatters';
import type { useTokenFormatters } from '@/hooks/tokens/useTokenFormatters';

const DUST_EXECUTION_TYPE = 'dust_conversion';

export interface DustExecutionTrackingContext {
  dustSummary: DustSummaryValue;
  composerQuote?: ComposeResponseData;
  slippage: number;
}

export interface ParseDustExecutionTrackingDataOptions {
  txHash?: Hex;
  durationMs?: number;
  routeId?: string;
  transactionStatus?: string;
  message?: string;
  isFinal?: boolean;
}

export interface ParseDustExecutionTrackingDataFormatters {
  toAggregatedAmountUSD: ReturnType<
    typeof usePortfolioFormatters
  >['toAggregatedAmountUSD'];
  toDisplayAmount: ReturnType<typeof useTokenFormatters>['toDisplayAmount'];
}

export const parseDustExecutionDataToTrackingData = (
  context: DustExecutionTrackingContext,
  formatters: ParseDustExecutionTrackingDataFormatters,
  options?: ParseDustExecutionTrackingDataOptions,
): TrackTransactionDataProps => {
  const { dustSummary, composerQuote, slippage } = context;
  const { txHash, durationMs, transactionStatus, message, isFinal } =
    options ?? {};

  const chainId = dustSummary.nativeToken.chainId;
  const tokenCount = dustSummary.selectedBalances.length;
  const inputUsd =
    composerQuote?.priceImpact.inputValueUsd ??
    formatters.toAggregatedAmountUSD(dustSummary.selectedBalances) ??
    0;
  const outputUsd =
    composerQuote?.priceImpact.outputValueUsd ?? dustSummary.amountUSD ?? 0;
  const approvalCount = composerQuote?.approvals?.length ?? 0;

  return {
    [TrackingEventParameter.FromAmount]: dustSummary.amount,
    [TrackingEventParameter.FromAmountUSD]: String(inputUsd),
    [TrackingEventParameter.FromChainId]: chainId,
    [TrackingEventParameter.FromToken]: dustSummary.selectedBalances
      .map((b) => b.token.address)
      .join(','),
    [TrackingEventParameter.IsFinal]: isFinal ?? false,
    [TrackingEventParameter.NbOfSteps]: approvalCount + 1,
    [TrackingEventParameter.RouteId]: 'missing',
    [TrackingEventParameter.Slippage]: slippage ?? 0,
    [TrackingEventParameter.MaxSlippage]: 'auto',
    [TrackingEventParameter.StepIds]: '',
    [TrackingEventParameter.Steps]: 'composer',
    [TrackingEventParameter.Time]: durationMs ?? 0,
    [TrackingEventParameter.ToAmount]: dustSummary.amount,
    [TrackingEventParameter.ToAmountMin]: dustSummary.amount,
    [TrackingEventParameter.ToAmountFormatted]: formatters.toDisplayAmount({
      token: dustSummary.nativeToken,
      amount: BigInt(dustSummary.amount),
    }),
    [TrackingEventParameter.ToAmountUSD]: outputUsd,
    [TrackingEventParameter.ToChainId]: chainId,
    [TrackingEventParameter.ToToken]: dustSummary.nativeToken.address,
    [TrackingEventParameter.TokenCount]: tokenCount,
    [TrackingEventParameter.TransactionId]: txHash ?? 'missing',
    [TrackingEventParameter.TransactionStatus]:
      transactionStatus ?? (txHash ? 'COMPLETED' : 'STARTED'),
    [TrackingEventParameter.Type]: DUST_EXECUTION_TYPE,
    ...(message && { [TrackingEventParameter.Message]: message }),
    ...(txHash && { [TrackingEventParameter.TransactionHash]: txHash }),
  };
};
