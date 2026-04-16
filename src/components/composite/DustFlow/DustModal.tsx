import { ModalContainer } from '@/components/core/modals/ModalContainer/ModalContainer';
import type { FC } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { JumperWidget } from '@/components/composite/JumperWidget/JumperWidget';
import { widgetStyle } from './constants';
import { useDustBalances } from './hooks/useDustBalances';
import { useFallbackNativeToken } from './hooks/useFallbackNativeToken';
import type { DustSummaryValue } from './hooks/useDustFormFields';
import { useDustFormFields } from './hooks/useDustFormFields';
import type { ViewSubmitContext } from '../JumperWidget/types';
import { RouteOverview } from './components/RouteOverview';
import { useTransactionForm } from '@/hooks/transactions/useTransactionForm';
import { useDustConversionStatusSheet } from './hooks/useDustConversionStatusSheet';
import { createTokenBalance } from '@/types/tokens';
import { usePortfolioState } from '@/providers/PortfolioProvider/PortfolioContext';
import { useTranslation } from 'react-i18next';
import { ConvertDustSubmitButton } from './components/ConvertDustSubmitButton';
import { RouteOverviewSubmitButton } from './components/RouteOverviewSubmitButton';
import { useDustComposerQuote } from './hooks/useDustComposerQuote';
import type { NavigationContextValue } from '../JumperWidget/context';
import { useTokenAmountInput } from '@/hooks/tokens/useTokenAmountInput';

interface DustModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DustModal: FC<DustModalProps> = ({ isOpen, onClose }) => {
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
  const [slippage, _setSlippage] = useState(0.01);
  const [widgetNav, setWidgetNav] = useState<NavigationContextValue | null>(
    null,
  );
  const { composerQuote, fetchComposerQuoteAsync } = useDustComposerQuote();
  const { toAmountFromPrice, toRawAmount } = useTokenAmountInput();

  const isDustSelection = widgetNav?.currentViewId === 'form';

  useEffect(() => {
    if (
      widgetNav?.currentViewId === 'summary' &&
      (!dustSummary || !composerQuote)
    ) {
      widgetNav.goToView('form');
    }
  }, [widgetNav, dustSummary, composerQuote]);

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
    executorType: 'single',
    fetchCallData,
    onSuccess: () => {
      refreshPortfolio();
    },
  });

  const statusSheet = useDustConversionStatusSheet({
    transactionForm,
    toTokenBalance: nativeTokenBalance,
    onSuccess: () => setDustSummary(null),
  });

  const handleModalClose = () => {
    onClose();
    transactionForm.resetForm();
  };

  const views = useMemo(
    () => [
      {
        type: 'form' as const,
        id: 'form',
        title: t('portfolio.dustConversion.title'),
        fields: formFields,
        onSubmit: async ({ values }: ViewSubmitContext) => {
          const dustSummary = values.dustSummary as
            | DustSummaryValue
            | undefined;

          if (dustSummary) {
            setDustSummary(values.dustSummary as DustSummaryValue);
          }

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
            slippage={slippage}
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
      slippage,
      nativeTokenBalance,
      formFields,
      transactionForm,
      t,
    ],
  );

  return (
    <ModalContainer isOpen={isOpen} onClose={handleModalClose}>
      {isOpen ? (
        <JumperWidget
          views={views}
          statusSheet={statusSheet}
          style={widgetStyle}
          onNavigation={setWidgetNav}
        />
      ) : null}
    </ModalContainer>
  );
};
