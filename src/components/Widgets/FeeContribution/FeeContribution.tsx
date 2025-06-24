import { useAccount } from '@lifi/wallet-management';
import * as Sentry from '@sentry/nextjs';
import { useEffect, useMemo, useRef, useState } from 'react';
import { TrackingAction, TrackingCategory } from 'src/const/trackingKeys';
import { DEFAULT_WALLET_ADDRESS } from 'src/const/urls';
import { useGetTokenBalance } from 'src/hooks/useGetTokenBalance';
import { useUserTracking } from 'src/hooks/userTracking/useUserTracking';
import { useTxHistory } from 'src/hooks/useTxHistory';
import { useContributionStore } from 'src/stores/contribution/ContributionStore';
import { useRouteStore } from 'src/stores/route/RouteStore';
import {
  createNativeTransactionConfig,
  createTokenTransactionConfig,
} from 'src/utils/transaction';
import { parseUnits } from 'viem';
import {
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import {
  CONTRIBUTION_AB_TEST_PERCENTAGE,
  CONTRIBUTION_AMOUNTS,
} from './constants';
import { ContributionWrapper } from './FeeContribution.style';
import { FeeContributionDrawer } from './FeeContributionDrawer';
import * as helper from './helper';
import {
  checkContributionByTxHistory,
  getContributionAmounts,
  getContributionFeeAddress,
} from './utils';

export interface ContributionTranslations {
  title: string;
  thankYou: string;
  description: string;
  custom: string;
  confirm: string;
  error: {
    amountTooSmall: string;
    noFeeAddress: string;
    errorSending: string;
    invalidTokenPrice: string;
  };
}

export interface FeeContributionProps {
  translations: ContributionTranslations;
}

const FeeContribution: React.FC<FeeContributionProps> = ({ translations }) => {
  const { account } = useAccount();
  const { trackEvent } = useUserTracking();
  const [contributionOptions, setContributionOptions] = useState<number[]>(
    CONTRIBUTION_AMOUNTS.DEFAULT,
  );
  const [isOpen, setIsOpen] = useState(true);

  // AB test flag - show contribution for ~10% of users
  const isContributionAbEnabled = useMemo(() => {
    return Math.random() < CONTRIBUTION_AB_TEST_PERCENTAGE;
  }, []);

  const [amount, setAmount] = useState<string>('');
  const [inputAmount, setInputAmount] = useState<string>('');
  const [isSending, setIsSending] = useState(false);

  const { completedRoute } = useRouteStore((state) => state);
  const {
    contributed,
    setContributed,
    contributionDisplayed,
    setContributionDisplayed,
  } = useContributionStore((state) => state);

  const { data } = useTxHistory(account?.address, completedRoute?.id);
  const { data: tokenBalanceData } = useGetTokenBalance(
    account?.address,
    completedRoute?.toToken,
  );

  const {
    data: writeTxHash,
    isPending: isTxPending,
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
    hash: writeTxHash,
    confirmations: 1,
    pollingInterval: 1_000,
  });

  const hasTrackedImpressionRef = useRef(false);
  const hasTrackedConfirmationRef = useRef(false);

  const isTransactionLoading = useMemo(
    () => isSending || isTxPending || isTxConfirming || isNativeTxPending,
    [isSending, isTxPending, isTxConfirming, isNativeTxPending],
  );

  // Calculate max amount in USD based on token balance
  const maxUsdAmount = useMemo(() => {
    const maxTokenAmount = tokenBalanceData
      ? Number(tokenBalanceData.amount) /
        Math.pow(10, tokenBalanceData.decimals)
      : 0;
    return maxTokenAmount * Number(completedRoute?.toToken?.priceUSD);
  }, [tokenBalanceData, completedRoute?.toToken?.priceUSD]);

  // Early synchronous eligibility checks
  const isEligibleBySyncChecks = useMemo(() => {
    if (!account?.chainType || !completedRoute?.toAmountUSD) {
      return false;
    }

    return (
      helper.isEvmChainType(account.chainType) &&
      helper.isTransactionAmountEligible(completedRoute.toAmountUSD) &&
      helper.hasValidContributionFeeAddress(completedRoute.toChainId)
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
    return checkContributionByTxHistory(data?.transfers);
  }, [isEligibleBySyncChecks, data?.transfers]);

  // Final eligibility determination
  const isEligible = useMemo(() => {
    return (
      isEligibleBySyncChecks && isEligibleByTxHistory && isContributionAbEnabled
    );
  }, [isEligibleBySyncChecks, isEligibleByTxHistory, isContributionAbEnabled]);

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
    //   !helper.isEligibleForContribution(
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
    const txUsdAmount = Number(completedRoute?.toAmountUSD);
    setContributionDisplayed(true);
    setContributionOptions(getContributionAmounts(txUsdAmount));
  }, [
    data?.transfers,
    completedRoute?.toAmountUSD,
    account?.chainType,
    isContributionAbEnabled,
    completedRoute?.toChainId,
  ]);

  // Track contribution impression
  useEffect(() => {
    if (
      completedRoute &&
      contributionDisplayed &&
      !hasTrackedImpressionRef.current
    ) {
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
    }
  }, [contributionDisplayed]);

  // Handle contribution confirmation to sign the tx
  const handleConfirm = async () => {
    if (contributed) {
      console.log('contributed, set false now', contributed);
      setIsOpen(false);
      return;
    }
    if (
      isTxConfirmed ||
      isNativeTxSuccess ||
      !amount ||
      !completedRoute?.toToken ||
      !account?.address
    )
      return;

    setIsSending(true);
    try {
      // amount is in USD, convert to token amount
      const tokenPriceUSD = Number(completedRoute.toToken.priceUSD);
      const sentryHint = {
        tags: {
          component: 'FeeContribution',
          action: 'handleConfirm',
        },
      };
      if (!tokenPriceUSD || tokenPriceUSD <= 0) {
        Sentry.captureException(
          new Error(translations.error.invalidTokenPrice),
          sentryHint,
        );
        throw new Error(translations.error.invalidTokenPrice);
      }
      const usdAmount = Number(amount);
      // Use token's actual decimals for precision
      const tokenAmount = (usdAmount / tokenPriceUSD).toFixed(
        completedRoute.toToken.decimals,
      );

      // Ensure we have a non-zero amount after conversion
      if (Number(tokenAmount) === 0) {
        Sentry.captureException(
          new Error(translations.error.amountTooSmall),
          sentryHint,
        );
        throw new Error(translations.error.amountTooSmall);
      }

      // Get the contribution fee address for the chain
      const feeAddress = getContributionFeeAddress(completedRoute.toChainId);
      if (!feeAddress) {
        Sentry.captureException(
          new Error(translations.error.noFeeAddress),
          sentryHint,
        );
        throw new Error(translations.error.noFeeAddress);
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
        if (
          errorMessage === translations?.error?.amountTooSmall ||
          errorMessage === translations?.error?.noFeeAddress ||
          errorMessage === translations?.error?.invalidTokenPrice
        ) {
          errorMessage === translations?.error?.invalidTokenPrice;
        }
        {
          console.error(errorMessage);
          Sentry.captureException(
            `${translations.error.errorSending}: ${errorMessage}`,
            {
              tags: {
                component: 'FeeContribution',
                action: 'handleConfirm',
              },
              extra: {
                tokenAddress: completedRoute?.toToken?.address,
                chainId: completedRoute?.toChainId,
                amount,
              },
            },
          );
        }
      }
    } finally {
      setIsSending(false);
    }
  };

  const isCustomAmountActive = useMemo(() => {
    return (
      !!amount &&
      !contributionOptions.includes(Number(amount)) &&
      Number(amount) > 0
    );
  }, [amount, contributionOptions]);

  // Move the setContributed logic to useEffect
  useEffect(() => {
    if (
      completedRoute &&
      (isTxConfirmed || isNativeTxSuccess) &&
      !hasTrackedConfirmationRef.current
    ) {
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
    }
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

  console.log('contributionDisplayed', contributionDisplayed);

  if (!contributionDisplayed) {
    return null;
  }

  return (
    <ContributionWrapper showContribution={isOpen}>
      <FeeContributionDrawer
        translations={translations}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        contributionOptions={contributionOptions}
        amount={amount}
        inputAmount={inputAmount}
        contributed={contributed}
        isTransactionLoading={isTransactionLoading}
        maxUsdAmount={maxUsdAmount}
        isCustomAmountActive={isCustomAmountActive}
        setAmount={setAmount}
        setInputAmount={setInputAmount}
        onConfirm={handleConfirm}
      />
    </ContributionWrapper>
  );
};

export default FeeContribution;
