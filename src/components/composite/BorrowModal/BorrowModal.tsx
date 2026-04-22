'use client';

import { getLoopoorMarket } from '@/app/lib/getLoopoorMarket';
import { getLoopoorStats } from '@/app/lib/getLoopoorStats';
import { JumperWidget } from '@/components/composite/JumperWidget/JumperWidget';
import type { AmountValue } from '@/components/composite/JumperWidget/components/Amount';
import type { ViewSubmitContext } from '@/components/composite/JumperWidget/types';
import {
  defineAmountField,
  defineTokenSingleSelectField,
} from '@/components/composite/JumperWidget/utils';
import {
  ERC20_ABI,
  MORPHO_ABI,
  PERMIT2_ABI,
} from '@/components/Widgets/variants/portfolio/loopoor/abis';
import { buildLoopoorMulticall } from '@/components/Widgets/variants/portfolio/loopoor/build-transaction';
import {
  getLoopoorChainConfig,
  MAX_UINT256,
  PERMIT2_ADDRESS,
} from '@/components/Widgets/variants/portfolio/loopoor/constants';
import { fetchLoopoorLifiQuote } from '@/components/Widgets/variants/portfolio/loopoor/lifi-quote';
import { toMorphoMarketParams } from '@/components/Widgets/variants/portfolio/loopoor/market-params';
import {
  buildMorphoAuthorizationTypedData,
  buildPermit2TypedData,
  splitMorphoSignature,
} from '@/components/Widgets/variants/portfolio/loopoor/signatures';
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
import type { Address, Hex } from 'viem';
import { encodeFunctionData, parseUnits } from 'viem';
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
import { usePublicClient, useSignTypedData } from 'wagmi';
import { BorrowStatsField } from './components/BorrowStatsField';
import { BorrowSubmitButton } from './components/BorrowSubmitButton';
import { BORROW_STATUS_KEYS, widgetStyle } from './constants';
import { LeverageContext, useLeverageContext } from './context';
import { BorrowModalView } from './types';

const SLIPPAGE = 0.005;
const SAFETY_BUFFER = 0.95;
const SIGNATURE_TTL_SECONDS = 3600;

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
  const publicClient = usePublicClient({ chainId: market.chainId });
  const { mutateAsync: signTypedData } = useSignTypedData();

  const [amount, setAmount] = useState('0');
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
    if (!accountAddress) {
      throw new Error('Connect a wallet first.');
    }
    if (!publicClient) {
      throw new Error('No public client for this chain.');
    }

    const chainConfig = getLoopoorChainConfig(market.chainId);
    const parsedAmount = parseUnits(
      amount || '0',
      market.collateralToken.decimals,
    );

    const marketRes = await getLoopoorMarket(market.chainId, market.marketId);
    // @ts-expect-error backend envelope
    const marketData = marketRes.data.data;
    if (!marketData) {
      throw new Error('Failed to load market');
    }
    const marketParams = toMorphoMarketParams(marketData);
    const collateralAddr = marketParams.collateralToken;
    const loanAddr = marketParams.loanToken;

    const statsRes = await getLoopoorStats(market.chainId, market.marketId, {
      leverageFactor: debouncedLeverageFactor,
      amount: parsedAmount.toString(),
      slippage: SLIPPAGE,
      safetyBuffer: SAFETY_BUFFER,
    });
    // @ts-expect-error backend envelope
    const stats = statsRes.data.data;
    if (!stats?.flashLoanAmount) {
      throw new Error('Stats returned no flashLoanAmount');
    }
    const flashLoanAmount = BigInt(stats.flashLoanAmount);

    const [morphoNonce, permit2Allowance, erc20Allowance] = await Promise.all([
      publicClient.readContract({
        address: chainConfig.morpho,
        abi: MORPHO_ABI,
        functionName: 'nonce',
        args: [accountAddress],
      }),
      publicClient.readContract({
        address: PERMIT2_ADDRESS,
        abi: PERMIT2_ABI,
        functionName: 'allowance',
        args: [accountAddress, collateralAddr, chainConfig.generalAdapter1],
      }),
      publicClient.readContract({
        address: collateralAddr,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [accountAddress, PERMIT2_ADDRESS],
      }),
    ]);
    const [, , permit2Nonce] = permit2Allowance as readonly [
      bigint,
      number,
      number,
    ];

    const quote = await fetchLoopoorLifiQuote({
      chainId: market.chainId,
      loanToken: loanAddr,
      collateralToken: collateralAddr,
      flashLoanAmount,
      adapter: chainConfig.swapAdapter,
      slippage: SLIPPAGE,
    });

    const nowSec = BigInt(Math.floor(Date.now() / 1000));
    const deadline = nowSec + BigInt(SIGNATURE_TTL_SECONDS);

    const morphoTypedData = buildMorphoAuthorizationTypedData({
      chainId: market.chainId,
      user: accountAddress,
      nonce: morphoNonce as bigint,
      deadline,
    });
    const morphoSigHex = (await signTypedData({
      domain: morphoTypedData.domain,
      types: morphoTypedData.types,
      primaryType: morphoTypedData.primaryType,
      message: morphoTypedData.message,
    })) as Hex;
    const morphoSig = splitMorphoSignature(morphoSigHex);

    const permit2TypedData = buildPermit2TypedData({
      chainId: market.chainId,
      token: collateralAddr,
      amount: parsedAmount,
      expiration: Number(deadline),
      nonce: Number(permit2Nonce),
      sigDeadline: deadline,
    });
    const permit2SigHex = (await signTypedData({
      domain: permit2TypedData.domain,
      types: permit2TypedData.types,
      primaryType: permit2TypedData.primaryType,
      message: permit2TypedData.message,
    })) as Hex;

    const { calldata } = buildLoopoorMulticall({
      chainId: market.chainId,
      user: accountAddress as Address,
      market: marketParams,
      initialCollateral: parsedAmount,
      flashLoanAmount,
      minSharePriceE27: 0n,
      quote,
      morphoAuth: morphoTypedData.message,
      morphoSig,
      permit2: permit2TypedData.message,
      permit2Sig: permit2SigHex,
    });

    const actions: {
      name: string;
      tx: { to: string; data: string; chainId: number };
    }[] = [];

    if ((erc20Allowance as bigint) < parsedAmount) {
      const approveData = encodeFunctionData({
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [PERMIT2_ADDRESS, MAX_UINT256],
      });
      actions.push({
        name: 'approve',
        tx: { to: collateralAddr, data: approveData, chainId: market.chainId },
      });
    }

    actions.push({
      name: 'multicall',
      tx: { to: chainConfig.bundler3, data: calldata, chainId: market.chainId },
    });

    return { actions };
  }, [
    accountAddress,
    publicClient,
    market,
    amount,
    debouncedLeverageFactor,
    signTypedData,
  ]);

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

  const handleSubmit = useCallback(async (props: ViewSubmitContext) => {
    setAmount((props.values.amount as AmountValue).amount);
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
            <BorrowSubmitButton
              isFormSubmitting={transactionForm.isSubmitting}
            />
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
