'use client';

import { JumperWidget } from '@/components/composite/JumperWidget/JumperWidget';
import {
  defineAmountField,
  defineTokenSingleSelectField,
} from '@/components/composite/JumperWidget/utils';
import { ModalContainer } from '@/components/core/modals/ModalContainer/ModalContainer';
import type { ModalContainerProps } from '@/components/core/modals/ModalContainer/ModalContainer';
import { useAccountAddress } from '@/hooks/earn/useAccountAddress';
import { useLoopoorMaxLeverage } from '@/hooks/loopoor/useLoopoorMaxLeverage';
import { useTransactionForm } from '@/hooks/transactions/useTransactionForm';
import { useTransactionStatusContent } from '@/hooks/transactions/useTransactionStatusContent';
import { useToken } from '@/hooks/useToken';
import type { LoopoorMarket } from '@/types/jumper-backend';
import type { ExtendedToken } from '@/types/tokens';
import type { ChainId } from '@lifi/sdk';
import type { Address } from 'viem';
import { PortfolioLeverageField } from '@/components/Widgets/variants/portfolio/PortfolioLeverageField';
import debounce from 'lodash/debounce';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
} from 'react';
import { useTranslation } from 'react-i18next';
import { BorrowStatsField } from './components/BorrowStatsField';
import { BorrowSubmitButton } from './components/BorrowSubmitButton';
import { BORROW_STATUS_KEYS, widgetStyle } from './constants';
import { LeverageContext, useLeverageContext } from './context';
import { BorrowModalView } from './types';

// Reads leverage from context so views stays stable while the slider moves.
const LeverageContent: FC = () => {
  const { leverageFactor, maxLeverageFactor, onChange } = useLeverageContext();
  return (
    <PortfolioLeverageField
      value={leverageFactor}
      max={maxLeverageFactor}
      onChange={onChange}
    />
  );
};

interface BorrowModalProps extends ModalContainerProps {
  market: LoopoorMarket;
  refetchCallback?: () => void;
}

export const BorrowModal: FC<BorrowModalProps> = ({
  isOpen,
  onClose,
  market,
  refetchCallback,
}) => {
  const { t } = useTranslation();
  const accountAddress = useAccountAddress();

  const [leverageFactor, setLeverageFactor] = useState(1);
  const [debouncedLeverageFactor, setDebouncedLeverageFactor] = useState(1);
  const debouncedSetLeverageFactor = useRef(
    debounce((value: number) => setDebouncedLeverageFactor(value), 300),
  ).current;

  useEffect(
    () => () => debouncedSetLeverageFactor.cancel(),
    [debouncedSetLeverageFactor],
  );

  const handleLeverageChange = useCallback(
    (value: number) => {
      setLeverageFactor(value);
      debouncedSetLeverageFactor(value);
    },
    [debouncedSetLeverageFactor],
  );

  const { data: maxLeverageData } = useLoopoorMaxLeverage({
    chainId: market.chainId,
    marketId: market.marketId,
  });
  const maxLeverageFactor = maxLeverageData?.maxLeverageFactor;

  const { token: fetchedCollateral } = useToken(
    market.chainId as ChainId,
    market.collateralToken.address as Address,
  );

  const collateralToken = useMemo(
    (): ExtendedToken => ({
      type: 'extended',
      address: fetchedCollateral?.address ?? market.collateralToken.address,
      symbol: fetchedCollateral?.symbol ?? market.collateralToken.symbol,
      name: market.collateralToken.symbol,
      logoURI: fetchedCollateral?.logoURI,
      decimals: fetchedCollateral?.decimals ?? market.collateralToken.decimals,
      chainId: market.chainId,
      priceUSD: (fetchedCollateral as any)?.priceUSD ?? '0',
    }),
    [market, fetchedCollateral],
  );

  const loanToken = useMemo(
    (): ExtendedToken => ({
      type: 'extended',
      address: market.loanToken.address,
      symbol: market.loanToken.symbol,
      name: market.loanToken.symbol,
      decimals: market.loanToken.decimals,
      chainId: market.chainId,
      priceUSD: '0',
    }),
    [market],
  );

  const availableTokens = useMemo(
    () => [collateralToken, loanToken],
    [collateralToken, loanToken],
  );

  const fetchCallData = useCallback(async () => {
    // TODO: replace with the actual borrow calldata endpoint
    throw new Error('Borrow calldata endpoint not yet implemented');
  }, [accountAddress, market, debouncedLeverageFactor]);

  const transactionForm = useTransactionForm({
    chainId: market.chainId,
    requiresConfirmation: true,
    fetchCallData,
    onSuccess: () => refetchCallback?.(),
  });

  const leverageContextValue = useMemo(
    () => ({
      leverageFactor,
      debouncedLeverageFactor,
      maxLeverageFactor,
      onChange: handleLeverageChange,
      isTransactionSubmitting: transactionForm.isSubmitting,
    }),
    [
      leverageFactor,
      debouncedLeverageFactor,
      maxLeverageFactor,
      handleLeverageChange,
      transactionForm.isSubmitting,
    ],
  );

  // Stable ref so views/handleSubmit never re-create due to transactionForm identity changing.
  const transactionFormRef = useRef(transactionForm);
  transactionFormRef.current = transactionForm;

  const handleSubmit = useCallback(async () => {
    transactionFormRef.current.handleSubmit();
  }, []);

  const handleModalClose = useCallback(() => {
    transactionFormRef.current.resetForm();
    onClose?.();
  }, [onClose]);

  const fields = useMemo(
    () => [
      defineTokenSingleSelectField({
        fieldKey: 'token',
        defaultValue: { selectedToken: collateralToken.address },
        fieldProps: {
          label: 'Collateral token',
          availableTokens,
          header: 'Select token',
        },
        sidePanelProps: {
          availableTokens,
          header: 'Select token',
        },
        t,
      }),
      defineAmountField({
        fieldKey: 'amount',
        defaultValue: { amount: '0', maxAmount: undefined },
        fieldProps: {
          token: collateralToken,
          label: t('form.labels.amount'),
        },
        schemaOptions: { requireNonZero: false },
        t,
      }),
    ],
    [availableTokens, collateralToken, t],
  );

  // views is stable: leverage/transaction state flow through LeverageContext,
  // so neither slider drags nor form submits cause defaultValues to reset.
  const views = useMemo(
    () => [
      {
        id: BorrowModalView.BORROW,
        type: 'form' as const,
        title: 'Loop',
        content: <LeverageContent />,
        fields,
        actions: (
          <>
            <BorrowStatsField market={market} />
            <BorrowSubmitButton />
          </>
        ),
        onSubmit: handleSubmit,
      },
    ],
    [fields, market, handleSubmit],
  );

  const statusContent = useTransactionStatusContent({
    keys: BORROW_STATUS_KEYS,
    errorType: transactionForm.errorType,
    handlers: {
      onCloseError: transactionForm.handleCloseError,
      onCloseSuccess: transactionForm.handleCloseSuccess,
      onRetry: transactionForm.handleRetry,
      onViewTransaction: transactionForm.handleViewTransaction,
      onConfirm: transactionForm.handleConfirm,
    },
  });

  const statusSheet = useMemo(() => {
    if (
      transactionForm.showConfirmationSheet &&
      statusContent.confirmationSheetContent
    ) {
      return {
        isOpen: true,
        content: statusContent.confirmationSheetContent,
        onClose: transactionForm.handleCloseSheet,
      };
    }
    if (transactionForm.showErrorBottomSheet) {
      return {
        isOpen: true,
        content: statusContent.errorSheetContent,
        onClose: transactionForm.handleCloseSheet,
      };
    }
    if (transactionForm.showSuccessSheet) {
      return {
        isOpen: true,
        content: statusContent.successSheetContent,
        onClose: transactionForm.handleCloseSuccess,
      };
    }
    return {
      isOpen: false,
      content: {
        title: '',
        callToAction: '',
        callToActionType: 'button' as const,
      },
      onClose: transactionForm.handleCloseSheet,
    };
  }, [
    transactionForm.showConfirmationSheet,
    transactionForm.showErrorBottomSheet,
    transactionForm.showSuccessSheet,
    transactionForm.handleCloseSheet,
    transactionForm.handleCloseSuccess,
    statusContent.confirmationSheetContent,
    statusContent.errorSheetContent,
    statusContent.successSheetContent,
  ]);

  return (
    <ModalContainer isOpen={isOpen} onClose={handleModalClose}>
      {isOpen ? (
        <LeverageContext.Provider value={leverageContextValue}>
          <JumperWidget
            views={views}
            statusSheet={statusSheet}
            style={widgetStyle}
          />
        </LeverageContext.Provider>
      ) : null}
    </ModalContainer>
  );
};
