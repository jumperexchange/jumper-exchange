import { useCallback, useRef } from 'react';
import type { Hex } from 'viem';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventDataAction,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import {
  parseDustExecutionDataToTrackingData,
  type DustExecutionTrackingContext,
  type ParseDustExecutionTrackingDataOptions,
} from '@/utils/tracking/dust';
import { useUserTracking } from './useUserTracking';
import { usePortfolioFormatters } from '../tokens/usePortfolioFormatters';
import { useTokenFormatters } from '../tokens/useTokenFormatters';

export const useDustConversionTracking = () => {
  const { trackTransaction } = useUserTracking();
  const { toAggregatedAmountUSD } = usePortfolioFormatters();
  const { toDisplayAmount } = useTokenFormatters();
  const executionStartedAtRef = useRef<number | null>(null);

  const buildAndTrack = useCallback(
    (
      context: DustExecutionTrackingContext,
      action: TrackingAction,
      label: string,
      eventAction: TrackingEventDataAction,
      options?: ParseDustExecutionTrackingDataOptions & {
        isConversion?: boolean;
      },
    ) => {
      const { isConversion, ...parseOptions } = options ?? {};
      const data = parseDustExecutionDataToTrackingData(
        context,
        { toAggregatedAmountUSD, toDisplayAmount },
        parseOptions,
      );
      data[TrackingEventParameter.Action] = eventAction;

      void trackTransaction({
        category: TrackingCategory.Portfolio,
        action,
        label,
        data,
        enableAddressable: true,
        ...(isConversion && { isConversion: true }),
      });
    },
    [trackTransaction, toAggregatedAmountUSD, toDisplayAmount],
  );

  const trackDustExecutionStarted = useCallback(
    (context: DustExecutionTrackingContext) => {
      executionStartedAtRef.current = Date.now();
      buildAndTrack(
        context,
        TrackingAction.OnRouteExecutionStartedDust,
        'execution_start_dust',
        TrackingEventDataAction.ExecutionStartDust,
        { transactionStatus: 'STARTED' },
      );
    },
    [buildAndTrack],
  );

  const trackDustExecutionCompleted = useCallback(
    (context: DustExecutionTrackingContext, txHash?: Hex) => {
      const startedAt = executionStartedAtRef.current;
      const durationMs =
        startedAt !== null ? Date.now() - startedAt : undefined;
      executionStartedAtRef.current = null;

      buildAndTrack(
        context,
        TrackingAction.OnRouteExecutionCompletedDust,
        'execution_completed_dust',
        TrackingEventDataAction.ExecutionCompletedDust,
        {
          txHash,
          durationMs,
          transactionStatus: 'COMPLETED',
          isConversion: true,
        },
      );
    },
    [buildAndTrack],
  );

  const trackDustExecutionFailed = useCallback(
    (
      context: DustExecutionTrackingContext,
      {
        message,
        txHash,
      }: {
        message: string;
        txHash?: Hex;
      },
    ) => {
      const startedAt = executionStartedAtRef.current;
      const durationMs =
        startedAt !== null ? Date.now() - startedAt : undefined;
      executionStartedAtRef.current = null;

      buildAndTrack(
        context,
        TrackingAction.OnRouteExecutionFailedDust,
        'execution_failed_dust',
        TrackingEventDataAction.ExecutionFailedDust,
        {
          txHash,
          durationMs,
          message,
          transactionStatus: 'FAILED',
          isFinal: true,
        },
      );
    },
    [buildAndTrack],
  );

  return {
    trackDustExecutionStarted,
    trackDustExecutionCompleted,
    trackDustExecutionFailed,
  };
};
