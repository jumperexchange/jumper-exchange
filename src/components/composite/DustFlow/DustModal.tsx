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
import { useWalletCapabilities } from '@/hooks/transactions/useWalletCapabilities';
import { TransactionErrorType } from '@/hooks/transactions/types';
import { useDustConversionStatusSheet } from './hooks/useDustConversionStatusSheet';
import { createTokenBalance } from '@/types/tokens';
import { usePortfolioState } from '@/providers/PortfolioProvider/PortfolioContext';
import type { Address } from 'viem';
import { type Hex } from 'viem';
import { useAccountAddress } from '@/hooks/earn/useAccountAddress';
import { useTranslation } from 'react-i18next';
import { ConvertDustSubmitButton } from './components/ConvertDustSubmitButton';
import { RouteOverviewSubmitButton } from './components/RouteOverviewSubmitButton';
import { buildDustQuoteParams, useDustQuotes } from './hooks/useDustQuotes';
import type { NavigationContextValue } from '../JumperWidget/context';
import { buildApprovalCallsForQuote } from './utils';
import { makeLifiComposerClient } from '@/app/lib/lifi-composer-client';

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
  const [widgetNav, setWidgetNav] = useState<NavigationContextValue | null>(
    null,
  );
  const { quotes, fetchQuotesAsync } = useDustQuotes();

  const isDustSelection = widgetNav?.currentViewId === 'form';

  useEffect(() => {
    if (
      widgetNav?.currentViewId === 'summary' &&
      (!dustSummary || !quotes?.length)
    ) {
      widgetNav.goToView('form');
    }
  }, [widgetNav, dustSummary, quotes]);

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
      const _quotes = await fetchQuotesAsync(buildDustQuoteParams(dustSummary));
      console.log('Fetched quotes:', _quotes);
      if (_quotes.length > 0 && widgetNav) {
        widgetNav.goToView('summary');
      }
      return undefined;
    }

    const client = makeLifiComposerClient();
    const chainId = dustSummary?.nativeToken.chainId ?? 1;
    const signer = dustSummary?.address ?? '';
    const balances = dustSummary?.selectedBalances ?? [];
    const inputNames = balances.map((b) => b.token.symbol.toLowerCase());

    const { data } = await client.compose({
      flow: {
        version: 1,
        id: 'dust-to-eth',
        chainId,
        inputs: balances.map((balance, i) => ({
          name: inputNames[i],
          resource: {
            kind: 'erc20' as const,
            token: balance.token.address,
            chainId,
          },
        })),
        nodes: balances.map((balance, i) => ({
          id: `swap_${inputNames[i]}`,
          op: 'lifi.swap' as const,
          bind: { amountIn: { $ref: `input.${inputNames[i]}` } },
          config: {
            resourceOut: { kind: 'native' as const, chainId },
            slippage: 0.01,
          },
        })),
      },
      run: {
        inputs: Object.fromEntries(
          balances.map((balance, i) => [
            inputNames[i],
            {
              kind: 'directDeposit' as const,
              amount: balance.amount.toString(),
            },
          ]),
        ),
        signer,
        sweepTo: signer,
        simulationPolicy: 'allow-revert',
        checkOnChainAllowances: true,
        maxPriceImpactBps: 1200,
      },
    });
    console.log('Received response from composer backend:', data);
    return {
      actions: [
        ...(data.approvals ?? []).map((approval) => ({
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
            to: data.transactionRequest.to,
            data: data.transactionRequest.data,
            value: data.transactionRequest.value,
            chainId: nativeTokenChainId,
          },
        },
      ],
    };
  }, [
    isDustSelection,
    widgetNav,
    dustSummary,
    nativeTokenChainId,
    fetchQuotesAsync,
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
        onSubmit: async ({ goToView, values }: ViewSubmitContext) => {
          const dustSummary = values.dustSummary as
            | DustSummaryValue
            | undefined;

          console.log('Dust Summary on submit:', dustSummary);

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
        content: <RouteOverview quotes={quotes} />,
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
    [quotes, formFields, transactionForm, t],
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
