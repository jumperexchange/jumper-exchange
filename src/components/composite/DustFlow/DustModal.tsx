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
import type { Hex } from 'viem';
import { useAccountAddress } from '@/hooks/earn/useAccountAddress';
import { useTranslation } from 'react-i18next';
import { ConvertDustSubmitButton } from './components/ConvertDustSubmitButton';
import { RouteOverviewSubmitButton } from './components/RouteOverviewSubmitButton';

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
    // @Note this is a placeholder ftm depending on how we'll approach the dust tx generation
    // However most probably we'll make use of the jumper backend client
    // const client = makeClient();
    // <some endpoint call here>
    // return data.data;

    return {
      actions: accountAddress
        ? [
            {
              name: 'Dummy tx',
              tx: {
                data: '0x' as Hex,
                chainId: nativeTokenChainId,
                to: accountAddress,
              },
            },
          ]
        : [],
    };
  }, [accountAddress, nativeTokenChainId]);

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
          goToView('summary');
          if (values.dustSummary) {
            setDustSummary(values.dustSummary as DustSummaryValue);
          }
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
        content: <RouteOverview />,
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
    [formFields, transactionForm, t],
  );

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose}>
      {isOpen ? (
        <JumperWidget
          views={views}
          statusSheet={statusSheet}
          style={widgetStyle}
        />
      ) : null}
    </ModalContainer>
  );
};
