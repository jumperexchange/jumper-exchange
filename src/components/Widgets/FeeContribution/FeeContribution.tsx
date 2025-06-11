import { useAccount } from '@lifi/wallet-management';
import CheckIcon from '@mui/icons-material/Check';
import { CircularProgress, Grid, InputAdornment } from '@mui/material';
import * as Sentry from '@sentry/nextjs';
import { useEffect, useMemo, useRef, useState } from 'react';
import { TrackingAction, TrackingCategory } from 'src/const/trackingKeys';
import { DEFAULT_WALLET_ADDRESS } from 'src/const/urls';
import { useGetTokenBalance } from 'src/hooks/useGetTokenBalance';
import { useUserTracking } from 'src/hooks/userTracking/useUserTracking';
import { useTxHistory } from 'src/hooks/useTxHistory';
import { useRouteStore } from 'src/stores/route/RouteStore';
import { createTokenTransactionConfig } from 'src/utils/transaction';
import { erc20Abi } from 'viem';

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
import {
  ContributionButton,
  ContributionButtonConfirm,
  ContributionCard,
  ContributionCardTitle,
  ContributionCustomInput,
  ContributionDescription,
  ContributionDrawer,
  ContributionWrapper,
  DrawerWrapper,
} from './FeeContribution.style';
import * as helper from './helper';
import {
  checkContributionByTxHistory,
  getContributionAmounts,
  getContributionFeeAddress,
} from './utils';

export interface ContributionTranslations {
  title: string;
  contributionSent: string;
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

  // AB test flag - show contribution for ~10% of users
  const isContributionAbEnabled = useMemo(() => {
    return Math.random() < CONTRIBUTION_AB_TEST_PERCENTAGE;
  }, []);
  const [amount, setAmount] = useState<string>('');
  const [inputAmount, setInputAmount] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const completedRoute = useRouteStore((state) => state.completedRoute);
  const { data } = useTxHistory(account?.address, completedRoute?.id);
  const { data: tokenBalanceData } = useGetTokenBalance(
    account?.address,
    completedRoute?.toToken,
  );
  const [showContribution, setShowContribution] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
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
    return true; // todo: remove
    if (!isEligibleBySyncChecks) {
      return false;
    }
    return checkContributionByTxHistory(data?.transfers);
  }, [isEligibleBySyncChecks, data?.transfers]);

  // Final eligibility determination
  const isEligible = useMemo(() => {
    return true;
    return (
      isEligibleBySyncChecks && isEligibleByTxHistory && isContributionAbEnabled
    );
  }, [isEligibleBySyncChecks, isEligibleByTxHistory, isContributionAbEnabled]);

  // Update contribution options when eligible
  useEffect(() => {
    if (!isEligible) {
      setShowContribution(false);
      return;
    }

    const txUsdAmount = Number(completedRoute?.toAmountUSD);
    setShowContribution(true);
    setContributionOptions(getContributionAmounts(txUsdAmount));
  }, [isEligible, completedRoute?.toAmountUSD]);

  // Check if contribution should be shown based on:
  // - Transaction history
  // - AB test
  // - Transaction amount >= $10
  // - Chain type is EVM
  // - Valid contribution fee address exists for the chain
  useEffect(() => {
    if (
      !helper.isEligibleForContribution(
        data,
        completedRoute,
        account,
        isContributionAbEnabled,
      )
    ) {
      setShowContribution(false);
      return;
    }

    // If eligible, set contribution amounts based on transaction amount
    const txUsdAmount = Number(completedRoute?.toAmountUSD);
    setShowContribution(true);
    setContributionOptions(getContributionAmounts(txUsdAmount));
  }, [
    data?.transfers,
    completedRoute?.toAmountUSD,
    account?.chainType,
    isContributionAbEnabled,
    completedRoute?.toChainId,
  ]);

  function onChangeValue(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    // First validate the input value
    const validatedValue = helper.validateInputAmount(value);
    const numericValue = Number(validatedValue);
    if (!isNaN(numericValue)) {
      if (numericValue > maxUsdAmount) {
        // Check if maxUsdAmount is bigger than the validated value
        const formattedMaxUsdAmount = helper.formatAmount(maxUsdAmount);
        setAmount(formattedMaxUsdAmount);
        setInputAmount(formattedMaxUsdAmount);
      } else {
        setAmount(validatedValue);
        setInputAmount(validatedValue);
      }
    }
  }

  // Track contribution impression
  useEffect(() => {
    if (
      completedRoute &&
      showContribution &&
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
  }, [showContribution]); // Only depend on showContribution

  // Track contribution success
  useEffect(() => {
    if (completedRoute && isTxConfirmed && !hasTrackedConfirmationRef.current) {
      trackEvent({
        action: TrackingAction.ContributeSuccess,
        category: TrackingCategory.Widget,
        label: 'fee_contribution_success',
        data: {
          ...(account?.address && { donator: account.address }),
          original_tx_id: completedRoute.id,
          donation_amount_usd: amount,
          donation_token_symbol: completedRoute.toToken?.symbol,
          donation_token_address: completedRoute.toToken?.address,
          donation_chain: completedRoute.toChainId,
          donation_tx_hash: txReceipt?.transactionHash,
        },
      });
      hasTrackedConfirmationRef.current = true;
    }
  }, [isTxConfirmed]); // Only depend on isTxConfirmed

  // Handle contribution button click
  const handleButtonClick = (selectedAmount: number) => {
    if (amount && Number(amount) === selectedAmount) {
      setAmount('');
    } else {
      const amountStr = selectedAmount.toString();
      setAmount(amountStr);
    }
  };

  // Handle custom contribution amount
  const handleCustom = () => {
    if (inputAmount && Number(inputAmount) > 0) {
      setAmount(inputAmount);
    }
  };

  // Handle contribution confirmation to sign the tx
  const handleConfirm = async () => {
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
        await sendTransaction({
          to: feeAddress as `0x${string}`,
          value: amountInTokenUnits,
        });
      } else {
        // Type assertion to ensure we're using the token transaction config
        const txConfig = createTokenTransactionConfig(
          completedRoute.toToken.address as `0x${string}`,
          feeAddress as `0x${string}`,
          amountInTokenUnits,
          completedRoute.toChainId,
        ) as {
          address: `0x${string}`;
          abi: typeof erc20Abi;
          functionName: 'transfer';
          args: [`0x${string}`, bigint];
        };

        await writeContract(txConfig);
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
  }, [amount]);

  if (!showContribution) {
    return null;
  }

  return (
    <ContributionWrapper showContribution={showContribution}>
      <DrawerWrapper ref={containerRef}>
        <ContributionDrawer
          open={showContribution}
          anchor="top"
          hideBackdrop={true}
          container={() => containerRef.current}
          ModalProps={{
            disablePortal: true,
            disableEnforceFocus: true,
            disableAutoFocus: true,
          }}
        >
          <ContributionCard>
            <ContributionCardTitle>{translations.title}</ContributionCardTitle>
            <Grid
              container
              spacing={2}
              columnSpacing={1}
              justifyContent={'space-between'}
            >
              {contributionOptions.map((contributionAmount) => (
                <Grid size={3} key={contributionAmount}>
                  <ContributionButton
                    selected={!!amount && Number(amount) === contributionAmount}
                    onClick={() => handleButtonClick(contributionAmount)}
                    size="small"
                  >
                    ${contributionAmount}
                  </ContributionButton>
                </Grid>
              ))}
              <Grid size={3}>
                <ContributionCustomInput
                  value={inputAmount}
                  aria-autocomplete="none"
                  onChange={onChangeValue}
                  onClick={handleCustom}
                  onFocus={handleCustom}
                  placeholder={translations.custom}
                  isCustomAmountActive={isCustomAmountActive}
                  hasInputAmount={!!inputAmount}
                  InputProps={{
                    startAdornment: inputAmount ? (
                      <InputAdornment position="start" disableTypography>
                        $
                      </InputAdornment>
                    ) : null,
                    sx: (theme) => ({
                      input: {
                        ...(inputAmount && {
                          width: inputAmount.length * 8 + 'px',
                          paddingLeft: theme.spacing(0.5),
                        }),
                        padding: inputAmount ? '0' : '0 16px',
                      },
                    }),
                  }}
                />
              </Grid>
            </Grid>

            {!!amount ? (
              <ContributionButtonConfirm
                onClick={handleConfirm}
                isTxConfirmed={isTxConfirmed || isNativeTxSuccess}
                disabled={isTransactionLoading}
              >
                {isTxConfirmed || isNativeTxSuccess ? <CheckIcon /> : null}
                {isTransactionLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : isTxConfirmed || isNativeTxSuccess ? (
                  translations.contributionSent
                ) : (
                  translations.confirm
                )}
              </ContributionButtonConfirm>
            ) : (
              <ContributionDescription>
                {translations.description}
              </ContributionDescription>
            )}
          </ContributionCard>
        </ContributionDrawer>
      </DrawerWrapper>
    </ContributionWrapper>
  );
};

export default FeeContribution;
