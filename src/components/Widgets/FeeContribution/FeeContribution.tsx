import * as Sentry from '@sentry/nextjs';
import { TrackingAction, TrackingCategory } from 'src/const/trackingKeys';
import { DEFAULT_WALLET_ADDRESS } from 'src/const/urls';

import { useAccount } from '@lifi/wallet-management';
import Grid from '@mui/material/Grid';
import { TFunction } from 'i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
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
import { CustomInput } from './CustomInput';
import {
  ContributionCard,
  ContributionCardTitle,
  ContributionDescription,
  ContributionWrapper,
} from './FeeContribution.style';
import { FeeContributionCTA } from './FeeContributionCTA';
import { FeeContributionDrawer } from './FeeContributionDrawer';
import { PredefinedButtons } from './PredefinedButtons';
import {
  checkContributionByTxHistory,
  getContributionAmounts,
  getContributionFeeAddress,
  hasValidContributionFeeAddress,
  isEvmChainType,
  isTransactionAmountEligible,
} from './utils';

export interface FeeContributionProps {
  translationFn: TFunction;
}

const FeeContribution: React.FC<FeeContributionProps> = ({ translationFn }) => {
  const { account } = useAccount();
  const { trackEvent } = useUserTracking();
  const [contributionOptions, setContributionOptions] = useState<number[]>(
    CONTRIBUTION_AMOUNTS.DEFAULT,
  );
  const [isOpen, setIsOpen] = useState(true);

  // AB test flag - show contribution for ~10% of users
  // @TODO: use feature flag from PostHog
  const isContributionAbEnabled = useMemo(() => {
    return Math.random() < CONTRIBUTION_AB_TEST_PERCENTAGE;
  }, []);

  const [predefinedAmount, setPredefinedAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [isManualValue, setIsManualValue] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const amount = useMemo(() => {
    if (isManualValue) {
      return customAmount;
    }
    return predefinedAmount;
  }, [isManualValue, customAmount, predefinedAmount]);

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
  const handleClickCTA = async () => {
    if (contributed) {
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
          new Error(translationFn('contribution.error.invalidTokenPrice')),
          sentryHint,
        );
        throw new Error(translationFn('contribution.error.invalidTokenPrice'));
      }
      const usdAmount = Number(amount);
      // Use token's actual decimals for precision
      const tokenAmount = (usdAmount / tokenPriceUSD).toFixed(
        completedRoute.toToken.decimals,
      );

      // Ensure we have a non-zero amount after conversion
      if (Number(tokenAmount) === 0) {
        Sentry.captureException(
          new Error(translationFn('contribution.error.amountTooSmall')),
          sentryHint,
        );
        throw new Error(translationFn('contribution.error.amountTooSmall'));
      }

      // Get the contribution fee address for the chain
      const feeAddress = getContributionFeeAddress(completedRoute.toChainId);
      if (!feeAddress) {
        Sentry.captureException(
          new Error(translationFn('contribution.error.noFeeAddress')),
          sentryHint,
        );
        throw new Error(translationFn('contribution.error.noFeeAddress'));
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
          `${translationFn('contribution.error.errorSending')}: ${errorMessage}`,
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
    } finally {
      setIsSending(false);
    }
  };

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

  if (!contributionDisplayed) {
    return null;
  }

  return (
    <ContributionWrapper showContribution={isOpen}>
      <FeeContributionDrawer isOpen={isOpen}>
        <ContributionCard>
          <ContributionCardTitle>
            {translationFn('contribution.title')}
          </ContributionCardTitle>
          <Grid
            container
            spacing={2}
            columnSpacing={1}
            justifyContent={'space-between'}
          >
            <PredefinedButtons
              isDisabled={contributed}
              options={contributionOptions}
              currentValue={predefinedAmount}
              isManualValue={isManualValue}
              setCurrentValue={setPredefinedAmount}
              setIsManualValue={setIsManualValue}
            />
            <CustomInput
              isDisabled={contributed}
              setIsManualValue={setIsManualValue}
              maxValue={maxUsdAmount}
              placeholder={
                !isManualValue ? translationFn('contribution.custom') : ''
              }
              setCurrentValue={setCustomAmount}
              currentValue={customAmount}
              isManualValue={isManualValue}
            />
          </Grid>

          {!!(customAmount || predefinedAmount) || contributed ? (
            <FeeContributionCTA
              contributed={contributed}
              isTransactionLoading={isTransactionLoading}
              handleClick={handleClickCTA}
              translationFn={translationFn}
            />
          ) : (
            <ContributionDescription>
              {translationFn('contribution.description')}
            </ContributionDescription>
          )}
        </ContributionCard>
      </FeeContributionDrawer>
    </ContributionWrapper>
  );
};

export default FeeContribution;
