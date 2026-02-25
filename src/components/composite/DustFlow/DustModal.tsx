import { ModalContainer } from '@/components/core/modals/ModalContainer/ModalContainer';
import type { FC } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { JumperWidget } from '@/components/composite/JumperWidget/JumperWidget';
import { MULTICALL3_ADDRESS, multicallAbi, widgetStyle } from './constants';
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
import { encodeFunctionData, type Hex } from 'viem';
import { useAccountAddress } from '@/hooks/earn/useAccountAddress';
import { useTranslation } from 'react-i18next';
import { ConvertDustSubmitButton } from './components/ConvertDustSubmitButton';
import { RouteOverviewSubmitButton } from './components/RouteOverviewSubmitButton';
import { buildDustQuoteParams, useDustQuotes } from './hooks/useDustQuotes';
import type { NavigationContextValue } from '../JumperWidget/context';
import { maxBy, sumBy } from 'lodash';

interface DustModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DustModal: FC<DustModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const accountAddress = useAccountAddress();
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
      if (_quotes.length > 0 && widgetNav) {
        widgetNav.goToView('summary');
      }

      return undefined;
    } else {
      if (!quotes) {
        return {
          actions: [],
        };
      }
      const args = quotes.map((quote) => {
        return {
          target: quote.action.toAddress as any,
          allowFailure: true,
          callData: (quote.transactionRequest?.data || '0x') as any,
        };
      });
      const gasPriceQuote = maxBy(quotes, (quote) =>
        BigInt(quote.transactionRequest?.gasPrice ?? '0'),
      );
      const gasPrice = BigInt(
        gasPriceQuote?.transactionRequest?.gasPrice ?? '0',
      );
      const gasLimit = quotes.reduce((acc, quote) => {
        return acc + BigInt(quote.transactionRequest?.gasLimit ?? '0');
      }, 0n);
      const encodedFnData = encodeFunctionData({
        abi: multicallAbi,
        functionName: 'aggregate3',
        args: [args],
      });

      return {
        actions: [
          {
            name: 'multicall',
            tx: {
              data: encodedFnData,
              chainId: nativeTokenChainId,
              to: MULTICALL3_ADDRESS,
              gasPrice,
              maxFeePerGas: gasLimit,
            },
          },
        ],
      };
    }
  }, [
    quotes,
    isDustSelection,
    widgetNav,
    dustSummary,
    nativeTokenChainId,
    fetchQuotesAsync,
  ]);

  const transactionForm = useTransactionForm({
    chainId: nativeTokenChainId,
    requiresConfirmation: false,
    fetchCallData,
    onSuccess: () => {
      refreshPortfolio();
    },
  });

  const statusSheet = useDustConversionStatusSheet({
    transactionForm,
    toTokenBalance: nativeTokenBalance,
  });

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
    <ModalContainer isOpen={isOpen} onClose={onClose}>
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
