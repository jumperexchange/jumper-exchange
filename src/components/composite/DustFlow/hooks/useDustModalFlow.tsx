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
import { RouteOverview } from '../components/RouteOverview';
import { ConvertDustSubmitButton } from '../components/ConvertDustSubmitButton';
import { RouteOverviewSubmitButton } from '../components/RouteOverviewSubmitButton';
import type {
  JumperWidgetFormFieldChangePayload,
  JumperWidgetFormListeners,
  NavigationContextValue,
} from '../../JumperWidget/context';
import type { DustSummaryValue } from '../types';
import { isNil } from '@/utils/isNil';
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
  const { refresh: refreshPortfolio } = usePortfolioState();
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

  const dustFieldSyncRef = useRef<{
    prevThreshold: number | 'init';
    prevChainId: number | 'init';
  }>({ prevThreshold: 'init', prevChainId: 'init' });

  useEffect(() => {
    if (isOpen) {
      dustFieldSyncRef.current = { prevThreshold: 'init', prevChainId: 'init' };
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
        if (sync.prevThreshold === 'init') {
          sync.prevThreshold = threshold;
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
        if (sync.prevChainId === 'init') {
          sync.prevChainId = chainId;
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
      if (!dustSummary) {
        throw new Error('Missing fields');
      }
      await fetchComposerQuoteAsync(dustSummary, slippage);

      if (widgetNav) {
        widgetNav.goToView('summary');
      }
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
  });

  const statusSheet = useDustConversionStatusSheet({
    transactionForm,
    toTokenBalance: nativeTokenBalance,
    onSuccess: () => {
      setDustSummary(null);
      refreshPortfolio();
      widgetNav?.resetForm();
    },
  });

  const handleModalClose = () => {
    onClose();
    transactionForm.resetForm();
    refreshPortfolio();
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
