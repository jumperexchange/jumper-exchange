import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type {
  JumperWidgetSettings,
  ViewSubmitContext,
} from '../../JumperWidget/types';
import { useTransactionForm } from '@/hooks/transactions/useTransactionForm';
import { useWalletCapabilities } from '@/hooks/transactions/useWalletCapabilities';
import { useTokenAmountInput } from '@/hooks/tokens/useTokenAmountInput';
import { createTokenBalance } from '@/types/tokens';
import { usePortfolioState } from '@/providers/PortfolioProvider/PortfolioContext';
import { widgetStyle } from '../constants';
import { useDustBalances } from './useDustBalances';
import { useFallbackNativeToken } from './useFallbackNativeToken';
import { useDustFormFields } from './useDustFormFields';
import { useDustComposerQuote } from './useDustComposerQuote';
import { useDustConversionStatusSheet } from './useDustConversionStatusSheet';
import { useDustConversionTracking } from '@/hooks/userTracking/useDustConversionTracking';
import {
  DustChainValidationError,
  DustPreparationError,
  extractFailedTokenAddresses,
} from '../dustComposerQuoteApi';
import { RouteOverview } from '../components/RouteOverview';
import { ConvertDustSubmitButton } from '../components/ConvertDustSubmitButton';
import { RouteOverviewSubmitButton } from '../components/RouteOverviewSubmitButton';
import type {
  JumperWidgetFormFieldChangePayload,
  JumperWidgetFormListeners,
  NavigationContextValue,
} from '../../JumperWidget/context';
import type { DustPartialQuoteState, DustSummaryValue } from '../types';
import { isNil } from '@/utils/isNil';
import type { Hex } from 'viem';
import {
  checkChainHasBalancesBelowThreshold,
  getFilteredBalances,
  selectTopAddresses,
  sortChainsByFilteredDustUsdDesc,
} from '../utils';
import type { ChainSingleSelectValue } from '@/components/composite/JumperWidget/components/Chain';
import type { NumericSelectValue } from '@/components/composite/JumperWidget/components/NumericSelect';

const widgetStyleMemo = widgetStyle;

interface UseDustModalFlowOptions {
  onClose: () => void;
  isOpen: boolean;
}

export const useDustModalFlow = ({
  onClose,
  isOpen,
}: UseDustModalFlowOptions) => {
  const { t } = useTranslation();
  const {
    trackDustExecutionStarted,
    trackDustExecutionCompleted,
    trackDustExecutionFailed,
  } = useDustConversionTracking();
  const { refreshForTokens } = usePortfolioState();
  const { nonNativeBalances, chains, nativeExtendedTokens } = useDustBalances();
  const fallbackNativeToken = useFallbackNativeToken(nativeExtendedTokens);
  const formFields = useDustFormFields({
    chains,
    nonNativeBalances,
    nativeExtendedTokens,
    fallbackNativeToken,
  });

  const [dustSummary, setDustSummary] = useState<DustSummaryValue | null>(null);
  const [slippage, setSlippage] = useState(0.03);
  const [widgetNav, setWidgetNav] = useState<NavigationContextValue | null>(
    null,
  );
  const [partialQuoteError, setPartialQuoteError] =
    useState<DustPartialQuoteState | null>(null);
  const [chainValidationError, setChainValidationError] =
    useState<DustChainValidationError | null>(null);
  const pendingDustSummaryRef = useRef<DustSummaryValue | null>(null);

  const dustFieldSyncRef = useRef<{
    prevThreshold: number | undefined;
    prevChainId: number | undefined;
  }>({ prevThreshold: undefined, prevChainId: undefined });

  const completedDustSummaryRef = useRef<DustSummaryValue | null>(null);
  const hasTrackedExecutionStartRef = useRef(false);
  const hasTrackedExecutionCompletedRef = useRef(false);
  const hasTrackedExecutionFailedRef = useRef(false);

  const resetTrackingFlags = useCallback(() => {
    hasTrackedExecutionStartRef.current = false;
    hasTrackedExecutionCompletedRef.current = false;
    hasTrackedExecutionFailedRef.current = false;
  }, []);

  const refreshCompletedDustTokens = useCallback(() => {
    const summary = completedDustSummaryRef.current;
    if (!summary) {
      return;
    }
    completedDustSummaryRef.current = null;
    void refreshForTokens(summary.address, [
      ...summary.selectedBalances.map((b) => b.token),
      summary.nativeToken,
    ]);
  }, [refreshForTokens]);

  useEffect(() => {
    if (isOpen) {
      dustFieldSyncRef.current = {
        prevThreshold: undefined,
        prevChainId: undefined,
      };
    }
  }, [isOpen]);

  const handleDustFormFieldChange = useCallback(
    ({ formApi, fieldApi }: JumperWidgetFormFieldChangePayload) => {
      const name = fieldApi.name;
      const sync = dustFieldSyncRef.current;

      if (name === 'amountThreshold') {
        const threshold = (
          formApi.getFieldValue('amountThreshold') as
            | NumericSelectValue
            | undefined
        )?.value;
        if (isNil(threshold)) {
          return;
        }
        if (sync.prevThreshold === threshold) {
          return;
        }
        sync.prevThreshold = threshold;

        const sorted = sortChainsByFilteredDustUsdDesc(
          chains.filter((c) =>
            checkChainHasBalancesBelowThreshold(
              nonNativeBalances,
              c.id,
              threshold,
            ),
          ),
          nonNativeBalances,
          threshold,
        );
        const topId = sorted[0]?.id;
        if (isNil(topId)) {
          return;
        }

        void formApi.setFieldValue('chain', { selectedChain: topId });

        const addresses = selectTopAddresses(
          getFilteredBalances(nonNativeBalances, topId, threshold),
        );
        void formApi.setFieldValue('balances', {
          selectedAddresses: addresses,
        });
        return;
      }

      if (name === 'chain') {
        const chain = formApi.getFieldValue('chain') as
          | ChainSingleSelectValue
          | undefined;
        const threshold = (
          formApi.getFieldValue('amountThreshold') as
            | NumericSelectValue
            | undefined
        )?.value;
        const chainId = chain?.selectedChain;
        if (isNil(chainId) || isNil(threshold)) {
          return;
        }
        if (sync.prevChainId === chainId) {
          return;
        }
        sync.prevChainId = chainId;
        const addresses = selectTopAddresses(
          getFilteredBalances(nonNativeBalances, chainId, threshold),
        );
        void formApi.setFieldValue('balances', {
          selectedAddresses: addresses,
        });
      }
    },
    [chains, nonNativeBalances],
  );

  const formListeners = useMemo<JumperWidgetFormListeners>(
    () => ({
      onChange: handleDustFormFieldChange,
    }),
    [handleDustFormFieldChange],
  );

  const { composerQuote, fetchComposerQuoteAsync } = useDustComposerQuote();
  const { toAmountFromPrice, toRawAmount } = useTokenAmountInput();

  const isDustSelection = widgetNav?.currentViewId === 'form';

  const nativeTokenBalance = useMemo(() => {
    if (!dustSummary?.nativeToken || !composerQuote) {
      return undefined;
    }

    const { nativeToken } = dustSummary;
    const tokenAmountString = toAmountFromPrice(
      composerQuote.priceImpact.outputValueUsd.toString(),
      nativeToken.priceUSD,
    );
    const amountRaw = toRawAmount(tokenAmountString, nativeToken.decimals);

    return createTokenBalance(nativeToken, amountRaw.toString());
  }, [dustSummary, composerQuote, toAmountFromPrice, toRawAmount]);

  const nativeTokenChainId = useMemo(
    () => dustSummary?.nativeToken.chainId ?? 1,
    [dustSummary?.nativeToken.chainId],
  );

  const { supportsBatchTransactions } =
    useWalletCapabilities(nativeTokenChainId);

  const fetchCallData = useCallback(async () => {
    if (isDustSelection) {
      const effectiveSummary = pendingDustSummaryRef.current ?? dustSummary;
      pendingDustSummaryRef.current = null;
      if (!effectiveSummary) {
        throw new Error('Missing fields');
      }

      try {
        await fetchComposerQuoteAsync(effectiveSummary, slippage);
      } catch (e) {
        if (e instanceof DustChainValidationError) {
          setChainValidationError(e);
          return undefined;
        }
        if (e instanceof DustPreparationError) {
          const failedAddresses = extractFailedTokenAddresses(e.failedOps);
          const failedBalances = effectiveSummary.selectedBalances.filter((b) =>
            failedAddresses.has(b.token.address.toLowerCase()),
          );
          const proceedableBalances = effectiveSummary.selectedBalances.filter(
            (b) => !failedAddresses.has(b.token.address.toLowerCase()),
          );
          setPartialQuoteError({ failedBalances, proceedableBalances });
          setDustSummary(effectiveSummary);
          return undefined;
        }
        throw e;
      }

      setDustSummary(effectiveSummary);
      widgetNav?.goToView('summary');
      return undefined;
    }

    if (!composerQuote) {
      throw new Error('Missing composer quote');
    }

    return {
      actions: [
        ...(composerQuote.approvals ?? []).map((approval) => ({
          name: 'approve' as const,
          tx: {
            to: approval.transactionRequest.to,
            data: approval.transactionRequest.data,
            value: approval.transactionRequest.value,
            chainId: nativeTokenChainId,
          },
        })),
        {
          name: 'composer' as const,
          tx: {
            to: composerQuote.transactionRequest.to,
            data: composerQuote.transactionRequest.data,
            value: composerQuote.transactionRequest.value,
            chainId: nativeTokenChainId,
          },
        },
      ],
    };
  }, [
    isDustSelection,
    widgetNav,
    dustSummary,
    slippage,
    composerQuote,
    nativeTokenChainId,
    fetchComposerQuoteAsync,
  ]);

  const transactionForm = useTransactionForm({
    chainId: nativeTokenChainId,
    requiresConfirmation: false,
    executorType: supportsBatchTransactions ? 'batch' : 'single',
    fetchCallData,
    onSuccess: () => {
      if (dustSummary) {
        completedDustSummaryRef.current = dustSummary;
      }
    },
  });

  useEffect(() => {
    const currentStep = transactionForm.currentStep;

    if (!dustSummary || !composerQuote || hasTrackedExecutionStartRef.current) {
      return;
    }

    if (currentStep !== 'approving' && currentStep !== 'requesting') {
      return;
    }

    hasTrackedExecutionStartRef.current = true;
    trackDustExecutionStarted({ dustSummary, composerQuote, slippage });
  }, [
    transactionForm.currentStep,
    dustSummary,
    composerQuote,
    slippage,
    trackDustExecutionStarted,
    resetTrackingFlags,
  ]);

  useEffect(() => {
    if (
      transactionForm.currentStep !== 'success' ||
      !transactionForm.showSuccessSheet ||
      !dustSummary ||
      !composerQuote ||
      hasTrackedExecutionCompletedRef.current
    ) {
      return;
    }

    const txHash = [...transactionForm.actionHashes]
      .reverse()
      .find((hash): hash is Hex => Boolean(hash));

    if (!txHash) {
      return;
    }

    hasTrackedExecutionCompletedRef.current = true;
    completedDustSummaryRef.current = dustSummary;
    trackDustExecutionCompleted(
      { dustSummary, composerQuote, slippage },
      txHash,
    );
  }, [
    transactionForm.currentStep,
    transactionForm.showSuccessSheet,
    transactionForm.actionHashes,
    dustSummary,
    composerQuote,
    slippage,
    trackDustExecutionCompleted,
  ]);

  useEffect(() => {
    if (
      !transactionForm.showErrorBottomSheet ||
      !dustSummary ||
      !composerQuote ||
      !hasTrackedExecutionStartRef.current ||
      hasTrackedExecutionFailedRef.current
    ) {
      return;
    }

    const txHash = [...transactionForm.actionHashes]
      .reverse()
      .find((hash): hash is Hex => Boolean(hash));

    hasTrackedExecutionFailedRef.current = true;
    trackDustExecutionFailed(
      { dustSummary, composerQuote, slippage },
      {
        message: transactionForm.errorType,
        txHash,
      },
    );
  }, [
    transactionForm.showErrorBottomSheet,
    transactionForm.errorType,
    transactionForm.actionHashes,
    dustSummary,
    composerQuote,
    slippage,
    trackDustExecutionFailed,
  ]);

  const handlePartialErrorProceed = useCallback(() => {
    if (!partialQuoteError || !dustSummary) {
      return;
    }
    const { proceedableBalances } = partialQuoteError;
    pendingDustSummaryRef.current = {
      ...dustSummary,
      selectedBalances: proceedableBalances,
      amountUSD: proceedableBalances.reduce(
        (sum, b) => sum + (b.amountUSD ?? 0),
        0,
      ),
    };
    setPartialQuoteError(null);
    void transactionForm.handleSubmit();
  }, [partialQuoteError, dustSummary, transactionForm]);

  const handlePartialErrorCancel = useCallback(() => {
    setPartialQuoteError(null);
    transactionForm.resetForm();
  }, [transactionForm]);

  const handleChainValidationErrorCancel = useCallback(() => {
    setChainValidationError(null);
    transactionForm.resetForm();
  }, [transactionForm]);

  const statusSheet = useDustConversionStatusSheet({
    transactionForm,
    toTokenBalance: nativeTokenBalance,
    partialQuoteError,
    chainValidationError,
    onPartialErrorProceed: handlePartialErrorProceed,
    onPartialErrorCancel: handlePartialErrorCancel,
    onChainValidationErrorCancel: handleChainValidationErrorCancel,
    onSuccess: () => {
      refreshCompletedDustTokens();
      setDustSummary(null);
      widgetNav?.resetForm();
    },
  });

  const handleModalClose = () => {
    onClose();
    transactionForm.resetForm();
    statusSheet.onClose();
    refreshCompletedDustTokens();
    resetTrackingFlags();
  };

  const views = useMemo(
    () => [
      {
        type: 'form' as const,
        id: 'form',
        title: t('portfolio.dustConversion.title'),
        fields: formFields,
        onSubmit: async ({ values }: ViewSubmitContext) => {
          const summary = values.dustSummary as DustSummaryValue | undefined;

          if (summary) {
            setDustSummary(summary);
          }

          widgetNav?.closeSidePanel();

          transactionForm.handleSubmit();
        },
        actions: (
          <ConvertDustSubmitButton
            isFormSubmitting={transactionForm.isSubmitting}
          />
        ),
      },
      {
        type: 'custom' as const,
        id: 'summary',
        title: t('portfolio.dustConversion.title'),
        content: (
          <RouteOverview
            composerQuote={composerQuote ?? undefined}
            nativeTokenBalance={nativeTokenBalance}
            selectedInputBalances={dustSummary?.selectedBalances ?? []}
            currentActionIndex={transactionForm.currentActionIndex}
            isExecuting={
              transactionForm.currentStep === 'approving' ||
              transactionForm.currentStep === 'requesting'
            }
            actionHashes={transactionForm.actionHashes}
            chainId={nativeTokenChainId}
          />
        ),
        onSubmit: async () => {
          transactionForm.handleSubmit();
        },
        actions: (
          <RouteOverviewSubmitButton
            isFormSubmitting={transactionForm.isSubmitting}
          />
        ),
      },
    ],
    [
      composerQuote,
      nativeTokenBalance,
      dustSummary,
      formFields,
      transactionForm,
      widgetNav,
      nativeTokenChainId,
      t,
    ],
  );

  const widgetSettings = useMemo<JumperWidgetSettings>(
    () => ({
      slippage: {
        value: slippage,
        defaultValue: 0.03,
        onChange: setSlippage,
        showWarning: false,
      },
    }),
    [slippage, setSlippage],
  );

  return {
    views,
    statusSheet,
    widgetSettings,
    widgetStyle: widgetStyleMemo,
    setWidgetNav,
    handleModalClose,
    formListeners,
  };
};
