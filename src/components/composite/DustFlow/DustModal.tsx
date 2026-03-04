import { ModalContainer } from '@/components/core/modals/ModalContainer/ModalContainer';
import type { FC } from 'react';
import { useCallback, useMemo, useState } from 'react';
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
import { fetchOdosAssemble, fetchOdosRouter } from './api/odos';
import { buildDustQuoteParams, useDustQuotes } from './hooks/useDustQuotes';
import type { NavigationContextValue } from '../JumperWidget/context';
import { useTranslation } from 'react-i18next';
import { ConvertDustSubmitButton } from './components/ConvertDustSubmitButton';
import { RouteOverviewSubmitButton } from './components/RouteOverviewSubmitButton';
import { useApproveTokens } from './hooks/useApproveTokens';
import type { Address, Hex } from 'viem';

interface DustModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DustModal: FC<DustModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { refresh: refreshPortfolio } = usePortfolioState();
  const approveTokens = useApproveTokens();
  const { nonNativeBalances, chains, nativeExtendedTokens } = useDustBalances();
  const fallbackNativeToken = useFallbackNativeToken(nativeExtendedTokens);
  const formFields = useDustFormFields({
    chains,
    nonNativeBalances,
    nativeExtendedTokens,
    fallbackNativeToken,
  });

  const [dustSummary, setDustSummary] = useState<DustSummaryValue | null>(null);
  const [widgetNav, setWidgetNav] = useState<NavigationContextValue | null>(
    null,
  );
  const { quote, fetchQuotesAsync } = useDustQuotes();

  const isDustSelection = widgetNav?.currentViewId === 'form';

  const nativeTokenBalance = useMemo(() => {
    if (!dustSummary?.nativeToken) {
      return undefined;
    }

    return createTokenBalance(dustSummary.nativeToken, dustSummary.amount);
  }, [dustSummary?.nativeToken, dustSummary?.amount]);

  const nativeTokenChainId = useMemo(
    () => dustSummary?.nativeToken.chainId ?? 1,
    [dustSummary?.nativeToken.chainId],
  );

  const fetchCallData = useCallback(async () => {
    if (isDustSelection) {
      if (!dustSummary) {
        throw new Error('Missing fields');
      }
      const odosQuote = await fetchQuotesAsync(
        buildDustQuoteParams(dustSummary),
      );
      if (odosQuote?.pathId && widgetNav) {
        widgetNav.goToView('summary');
      }
      return undefined;
    }

    if (!dustSummary) {
      throw new Error('Missing dust summary');
    }

    const [odosQuote, odosRouter] = await Promise.all([
      fetchQuotesAsync(buildDustQuoteParams(dustSummary)),
      fetchOdosRouter(dustSummary.nativeToken.chainId),
    ]);
    if (!odosQuote?.pathId) {
      throw new Error('No Odos quote pathId');
    }

    await approveTokens(
      dustSummary.selectedBalances.map((balance) => ({
        address: balance.token.address as Hex,
        amount: balance.amount,
      })),
      dustSummary.nativeToken.chainId,
      dustSummary.address as Address,
      odosRouter.address as Address,
    );

    const assembled = await fetchOdosAssemble({
      pathId: odosQuote.pathId,
      userAddr: dustSummary.address,
    });

    if (assembled.simulation && !assembled.simulation.isSuccess) {
      throw new Error(assembled.simulation.simulationError.errorMessage);
    }

    const tx = assembled.transaction;
    if (!tx?.to || !tx?.data) {
      throw new Error('Invalid Odos assemble response');
    }

    return {
      actions: [
        {
          name: 'sendTransaction',
          tx: {
            chainId: tx.chainId,
            to: tx.to,
            data: tx.data,
            value: tx.value ?? '0',
          },
        },
      ],
    };
  }, [
    isDustSelection,
    widgetNav,
    dustSummary,
    fetchQuotesAsync,
    approveTokens,
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
  });

  const handleModalClose = () => {
    onClose();
    transactionForm.resetForm();
  };

  console.log(quote);

  const views = useMemo(
    () => [
      {
        type: 'form' as const,
        id: 'form',
        title: t('portfolio.dustConversion.title'),
        fields: formFields,
        onSubmit: async ({ goToView, values }: ViewSubmitContext) => {
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
        content: <RouteOverview quote={quote} />,
        onSubmit: async ({ goToView }: ViewSubmitContext) => {
          transactionForm.handleSubmit();
        },
        actions: (
          <RouteOverviewSubmitButton
            isFormSubmitting={transactionForm.isSubmitting}
          />
        ),
      },
    ],
    [quote, formFields, transactionForm, t],
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
