import * as Sentry from '@sentry/nextjs';
import { useAccount } from '@lifi/wallet-management';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useGetTokenBalance } from 'src/hooks/useGetTokenBalance';
import { useTxHistory } from 'src/hooks/useTxHistory';
import { useRouteStore } from 'src/stores/route/RouteStore';
import {
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import {
  checkContributionByTxHistory,
  getContributionAmounts,
  getContributionFeeAddress,
  hasValidContributionFeeAddress,
  isEvmChainType,
  isTransactionAmountEligible,
} from './utils';
import { DEFAULT_WALLET_ADDRESS } from 'src/const/urls';
import { parseUnits } from 'viem';
import {
  createNativeTransactionConfig,
  createTokenTransactionConfig,
} from 'src/utils/transaction';
import { useUserTracking } from 'src/hooks/userTracking';
import { TrackingAction, TrackingCategory } from 'src/const/trackingKeys';
import { useContributionStore } from 'src/stores/contribution/ContributionStore';
import {
  CONTRIBUTION_AB_TEST_PERCENTAGE,
  CONTRIBUTION_AMOUNTS,
} from './constants';

export const useContributionAmounts = () => {
  const [predefinedAmount, setPredefinedAmount] = useState('');
  const [manualAmount, setManualAmount] = useState('');
  const [isManualValueSelected, setIsManualValueSelected] = useState(false);

  const amount = useMemo(
    () => (isManualValueSelected ? manualAmount : predefinedAmount),
    [manualAmount, predefinedAmount, isManualValueSelected],
  );

  return {
    amount,
    manualAmount,
    setManualAmount,
    predefinedAmount,
    setPredefinedAmount,
    isManualValueSelected,
    setIsManualValueSelected,
  };
};

export const useContributionData = () => {
  const [contributionOptions, setContributionOptions] = useState<number[]>(
    CONTRIBUTION_AMOUNTS.DEFAULT,
  );

  // AB test flag - show contribution for ~10% of users
  // @TODO: use feature flag from PostHog
  const isContributionAbEnabled = useMemo(() => {
    return Math.random() < CONTRIBUTION_AB_TEST_PERCENTAGE;
  }, []);

  const { setContributionDisplayed } = useContributionStore((state) => state);
  const { completedRoute } = useRouteStore((state) => state);
  const { account } = useAccount();
  const { data: txHistoryData } = useTxHistory(
    account?.address,
    completedRoute?.id,
  );

  const { data: tokenBalanceData } = useGetTokenBalance(
    account?.address,
    completedRoute?.toToken,
  );

  // Early synchronous eligibility checks
  const isEligibleBySyncChecks = useMemo(() => {
    if (!account?.chainType || !completedRoute?.toAmountUSD) {
      return false;
    }

    return (
      isEvmChainType(account.chainType) &&
      isTransactionAmountEligible(completedRoute.toAmountUSD) &&
      hasValidContributionFeeAddress(completedRoute.toChainId)
    );
  }, [
    account?.chainType,
    completedRoute?.toAmountUSD,
    completedRoute?.toChainId,
  ]);

  // Async-dependent eligibility check
  const isEligibleByTxHistory = useMemo(() => {
    if (!isEligibleBySyncChecks) {
      return false;
    }
    return checkContributionByTxHistory(txHistoryData?.transfers);
  }, [isEligibleBySyncChecks, txHistoryData?.transfers]);

  // Final eligibility determination
  const isEligible = useMemo(() => {
    return (
      isEligibleBySyncChecks && isEligibleByTxHistory && isContributionAbEnabled
    );
  }, [isEligibleBySyncChecks, isEligibleByTxHistory, isContributionAbEnabled]);

  const maxUsdAmount = useMemo(() => {
    const maxTokenAmount = tokenBalanceData
      ? Number(tokenBalanceData.amount) /
        Math.pow(10, tokenBalanceData.decimals)
      : 0;
    return 5.5; //maxTokenAmount * Number(completedRoute?.toToken?.priceUSD);
  }, [tokenBalanceData, completedRoute?.toToken?.priceUSD]);

  // Update contribution options when eligible
  useEffect(() => {
    // todo: re-enable this
    // if (!isEligible) {
    //   setContributionDisplayed(false);
    //   return;
    // }

    const txUsdAmount = Number(completedRoute?.toAmountUSD);
    setContributionDisplayed(true);
    setContributionOptions(getContributionAmounts(txUsdAmount));
  }, [isEligible, completedRoute?.toAmountUSD]);

  // Check if contribution should be shown based on:
  // - Transaction history
  // - AB test
  // - Transaction amount >= $10
  // - Chain type is EVM
  // - Valid contribution fee address exists for the chain
  useEffect(() => {
    // todo: re-enable this
    // if (
    //   contributed ||
    //   !isEligibleForContribution(
    //     data,
    //     completedRoute,
    //     account,
    //     isContributionAbEnabled,
    //   )
    // ) {
    //   setContributionDisplayed(false);
    //   return;
    // }
    // If eligible, set contribution amounts based on transaction amount
    // const txUsdAmount = Number(completedRoute?.toAmountUSD);
    // setContributionDisplayed(true);
    // setContributionOptions(getContributionAmounts(txUsdAmount));
  }, [
    txHistoryData?.transfers,
    completedRoute?.toAmountUSD,
    account?.chainType,
    isContributionAbEnabled,
    completedRoute?.toChainId,
  ]);

  return {
    contributionOptions,
    maxUsdContribution: maxUsdAmount,
  };
};

export const useSendContribution = (
  amount: string,
  closeContributionDrawer: () => void,
) => {
  const [isSending, setIsSending] = useState(false);

  const hasTrackedImpressionRef = useRef(false);
  const hasTrackedConfirmationRef = useRef(false);

  const { trackEvent } = useUserTracking();
  const { completedRoute } = useRouteStore((state) => state);
  const { account } = useAccount();

  const { contributed, setContributed, contributionDisplayed } =
    useContributionStore((state) => state);

  const {
    data: writeContractData,
    isPending: isWriteContractPending,
    writeContract,
  } = useWriteContract();

  const {
    sendTransaction,
    isSuccess: isNativeTxSuccess,
    isPending: isNativeTxPending,
  } = useSendTransaction();

  const {
    data: txReceipt,
    isLoading: isTxConfirming,
    isSuccess: isTxConfirmed,
  } = useWaitForTransactionReceipt({
    chainId: completedRoute?.toChainId,
    hash: writeContractData,
    confirmations: 1,
    pollingInterval: 1_000,
  });

  const isTransactionLoading = useMemo(
    () =>
      isSending ||
      isWriteContractPending ||
      isTxConfirming ||
      isNativeTxPending,
    [isSending, isWriteContractPending, isTxConfirming, isNativeTxPending],
  );

  // Track contribution impression
  useEffect(() => {
    if (
      !completedRoute ||
      !contributionDisplayed ||
      hasTrackedImpressionRef.current
    )
      return;

    trackEvent({
      action: TrackingAction.ContributeImpression,
      category: TrackingCategory.Widget,
      label: 'fee_contribution_impression',
      data: {
        ...(account?.address && { donator: account.address }),
        original_tx_id: completedRoute.id,
        original_amount: completedRoute.toAmount,
        original_amount_usd: completedRoute.toAmountUSD,
        original_token_symbol: completedRoute.toToken.symbol,
        original_donation_chain: completedRoute.toChainId,
        original_tx_token_address: completedRoute.toToken?.address,
      },
    });
    hasTrackedImpressionRef.current = true;
  }, [contributionDisplayed]);

  // Track contribution success
  useEffect(() => {
    if (
      !completedRoute ||
      !(isTxConfirmed || isNativeTxSuccess) ||
      hasTrackedConfirmationRef.current
    )
      return;

    trackEvent({
      action: TrackingAction.ContributeSuccess,
      category: TrackingCategory.Widget,
      label: 'fee_contribution_success',
      data: {
        ...(account?.address && { donator: account.address }),
        ...(txReceipt && { donation_tx_hash: txReceipt.transactionHash }),
        original_tx_id: completedRoute.id,
        donation_amount_usd: amount,
        donation_token_symbol: completedRoute.toToken?.symbol,
        donation_token_address: completedRoute.toToken?.address,
        donation_chain: completedRoute.toChainId,
      },
    });
    setContributed(true);
    hasTrackedConfirmationRef.current = true;
  }, [
    completedRoute,
    isTxConfirmed,
    isNativeTxSuccess,
    hasTrackedConfirmationRef,
    trackEvent,
    account?.address,
    amount,
    txReceipt?.transactionHash,
    setContributed,
  ]);

  // Handle contribution confirmation to sign the tx
  const sendContribution = async () => {
    if (contributed) {
      closeContributionDrawer();
      return;
    }
    if (
      isTxConfirmed ||
      isNativeTxSuccess ||
      !amount ||
      !completedRoute?.toToken ||
      !account?.address
    ) {
      return;
    }

    setIsSending(true);

    const sentryHint = {
      tags: {
        component: 'FeeContribution',
        action: 'handleConfirm',
      },
    };

    try {
      // amount is in USD, convert to token amount
      const tokenPriceUSD = Number(completedRoute.toToken.priceUSD);

      if (!tokenPriceUSD || tokenPriceUSD <= 0) {
        const error = new Error(`Invalid token price`);
        Sentry.captureException(error, sentryHint);
        throw error;
      }
      const usdAmount = Number(amount);
      // Use token's actual decimals for precision
      const tokenAmount = (usdAmount / tokenPriceUSD).toFixed(
        completedRoute.toToken.decimals,
      );

      // Ensure we have a non-zero amount after conversion
      if (Number(tokenAmount) === 0) {
        const error = new Error(
          `The contribution amount is too small for this token. Please try a larger amount.`,
        );
        Sentry.captureException(error, sentryHint);
        throw error;
      }

      // Get the contribution fee address for the chain
      const feeAddress = getContributionFeeAddress(completedRoute.toChainId);
      if (!feeAddress) {
        const error = new Error(
          `No contribution fee address configured for this chain.`,
        );
        Sentry.captureException(error, sentryHint);
        throw error;
      }

      // Track click event
      completedRoute &&
        trackEvent({
          action: TrackingAction.ClickContribute,
          category: TrackingCategory.Widget,
          label: 'click_fee_contribution',
          data: {
            ...(account?.address && { donator: account.address }),
            original_tx_id: completedRoute.id,
            donation_amount_usd: usdAmount,
            donation_amount_token: tokenAmount,
            donation_token_symbol: completedRoute.toToken.symbol,
            donation_token_address: completedRoute.toToken.address,
            donation_chain: completedRoute.toChainId,
          },
        });

      // Convert to token units with proper precision
      const amountInTokenUnits = parseUnits(
        tokenAmount,
        completedRoute.toToken.decimals,
      );

      if (completedRoute.toToken.address === DEFAULT_WALLET_ADDRESS) {
        const nativeTxConfig = createNativeTransactionConfig(
          feeAddress as `0x${string}`,
          amountInTokenUnits,
        );
        await sendTransaction(nativeTxConfig);
      } else {
        const erc20TxConfig = createTokenTransactionConfig(
          completedRoute.toToken.address as `0x${string}`,
          feeAddress as `0x${string}`,
          amountInTokenUnits,
          completedRoute.toChainId,
        );
        await writeContract(erc20TxConfig);
      }
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        console.error(errorMessage);
        Sentry.captureException(
          `Error sending contribution:: ${errorMessage}`,
          {
            ...sentryHint,
            extra: {
              tokenAddress: completedRoute?.toToken?.address,
              chainId: completedRoute?.toChainId,
              amount,
            },
          },
        );
      }
    } finally {
      setIsSending(false);
    }
  };

  return {
    sendContribution,
    isTransactionLoading,
  };
};
