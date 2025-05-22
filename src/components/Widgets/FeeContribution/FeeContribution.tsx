import { useAccount } from '@lifi/wallet-management';
import CheckIcon from '@mui/icons-material/Check';
import {
  CircularProgress,
  darken,
  Drawer,
  Grid,
  InputAdornment,
} from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { TrackingAction, TrackingCategory } from 'src/const/trackingKeys';
import { DEFAULT_WALLET_ADDRESS } from 'src/const/urls';
import { useGetTokenBalance } from 'src/hooks/useGetTokenBalance';
import { useUserTracking } from 'src/hooks/userTracking/useUserTracking';
import { useTxHistory } from 'src/hooks/useTxHistory';
import { useRouteStore } from 'src/stores/route/RouteStore';
import { formatInputAmount } from 'src/utils/format';
import {
  createNativeTransactionConfig,
  createTokenTransactionConfig,
  ERC20_TRANSFER_ABI,
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
import {
  ContributionButton,
  ContributionButtonConfirm,
  ContributionCard,
  ContributionCardTitle,
  ContributionCustomInput,
  ContributionDescription,
  ContributionWrapper,
  DrawerWrapper,
} from './FeeContribution.style';
import * as helper from './helper';
import { getContributionAmounts, getContributionFeeAddress } from './utils';
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
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [contributionOptions, setContributionOptions] = useState<number[]>(
    CONTRIBUTION_AMOUNTS.DEFAULT,
  );

  // AB test flag - show contribution for ~10% of users
  const isContributionAbEnabled = useMemo(() => {
    return Math.random() < CONTRIBUTION_AB_TEST_PERCENTAGE;
  }, []);
  const [amount, setAmount] = useState<string | undefined>();
  const [inputAmount, setInputAmount] = useState<string | undefined>(undefined);
  const [isSending, setIsSending] = useState(false);
  const completedRoute = useRouteStore((state) => state.completedRoute);
  const { data } = useTxHistory(address, completedRoute?.id);
  const { data: tokenBalanceData } = useGetTokenBalance(
    address,
    completedRoute?.toToken,
  );
  const [showContribution, setShowContribution] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    status: txStatus,
    data: writeTxHash,
    isPending: isTxPending,
    isError: isTxError,
    error: txError,
    writeContract,
  } = useWriteContract();
  const {
    data: hash,
    sendTransaction,
    isSuccess: isNativeTxSuccess,
    isPending: isNativeTxPending,
  } = useSendTransaction();

  const {
    data: txReceipt,
    isLoading: isTxConfirming,
    isSuccess: isTxConfirmed,
    isError: isTxConfirmError,
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

  function onChangeValue(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    // Calculate max amount in USD based on token balance
    const maxTokenAmount = tokenBalanceData
      ? Number(tokenBalanceData.amount) /
        Math.pow(10, tokenBalanceData.decimals)
      : 0;
    const maxUsdAmount =
      maxTokenAmount * Number(completedRoute?.toToken?.priceUSD || 0);
    const formattedAmount = formatInputAmount(value, 2, false, maxUsdAmount);
    setInputAmount(formattedAmount);
    setAmount(formattedAmount);
  }
  // Set the address of the user from last tx
  useEffect(() => {
    if (completedRoute?.fromAddress) {
      setAddress(completedRoute.fromAddress);
    }
  }, [completedRoute?.fromAddress]);

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
        completedRoute ?? undefined,
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

  // Handle contribution button click
  const handleButtonClick = (selectedAmount: number) => {
    if (!!amount && selectedAmount === parseFloat(amount)) {
      setAmount(undefined);
    } else {
      setAmount(selectedAmount.toString());
    }
  };

  // Handle custom contribution amount
  const handleCustom = () => {
    if (!!inputAmount && parseFloat(inputAmount) > 0) {
      setAmount(inputAmount);
    }
  };

  // Track contribution impression
  useEffect(() => {
    if (showContribution && !hasTrackedImpressionRef.current) {
      trackEvent({
        action: TrackingAction.ContributeImpression,
        category: TrackingCategory.Widget,
        label: 'fee_contribution_impression',
        data: {
          donator: account?.address || '',
          original_tx_id: completedRoute?.id || '',
          original_amount: completedRoute?.toAmount || '',
          original_amount_usd: completedRoute?.toAmountUSD || '',
          original_token_symbol: completedRoute?.toToken?.symbol || '',
          original_donation_chain: completedRoute?.toChainId || 0,
          original_tx_token_address: completedRoute?.toToken?.address || '',
        },
      });
      hasTrackedImpressionRef.current = true;
    }
  }, [showContribution]); // Only depend on showContribution

  // Track contribution success
  useEffect(() => {
    if (isTxConfirmed && !hasTrackedConfirmationRef.current) {
      trackEvent({
        action: TrackingAction.ContributeSuccess,
        category: TrackingCategory.Widget,
        label: 'fee_contribution_success',
        data: {
          donator: account?.address || '',
          original_tx_id: completedRoute?.id || '',
          donation_amount_usd: amount || 0,
          donation_token_symbol: completedRoute?.toToken?.symbol || '',
          donation_token_address: completedRoute?.toToken?.address || '',
          donation_chain: completedRoute?.toChainId || 0,
          donation_tx_hash: txReceipt?.transactionHash || '',
        },
      });
      hasTrackedConfirmationRef.current = true;
    }
  }, [isTxConfirmed]); // Only depend on isTxConfirmed

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
      if (!tokenPriceUSD || tokenPriceUSD <= 0)
        throw new Error(translations.error.invalidTokenPrice);

      const usdAmount = parseFloat(amount);
      // Use token's actual decimals for precision
      const tokenAmount = (usdAmount / tokenPriceUSD).toFixed(
        completedRoute.toToken.decimals,
      );

      // Ensure we have a non-zero amount after conversion
      if (parseFloat(tokenAmount) === 0) {
        throw new Error(translations.error.amountTooSmall);
      }

      // Get the contribution fee address for the chain
      const feeAddress = getContributionFeeAddress(completedRoute.toChainId);
      if (!feeAddress) {
        throw new Error(translations.error.noFeeAddress);
      }

      // Track click event
      trackEvent({
        action: TrackingAction.ClickContribute,
        category: TrackingCategory.Widget,
        label: 'click_fee_contribution',
        data: {
          donator: account?.address || '',
          original_tx_id: completedRoute?.id || '',
          donation_amount_usd: usdAmount || 0,
          donation_amount_token: tokenAmount || 0,
          donation_token_symbol: completedRoute?.toToken?.symbol || '',
          donation_token_address: completedRoute?.toToken?.address || '',
          donation_chain: completedRoute?.toChainId || 0,
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
        // Type assertion to ensure we're using the token transaction config
        const txConfig = createTokenTransactionConfig(
          completedRoute.toToken.address as `0x${string}`,
          feeAddress as `0x${string}`,
          amountInTokenUnits,
          completedRoute.toChainId,
        ) as {
          address: `0x${string}`;
          abi: typeof ERC20_TRANSFER_ABI;
          functionName: 'transfer';
          args: [`0x${string}`, bigint];
        };

        await writeContract(txConfig);
      }
    } catch (error) {
      console.error(translations.error.errorSending, error);
      if (error instanceof Error) {
        const errorMessage = error.message;
        if (errorMessage === translations?.error?.amountTooSmall) {
          console.error(errorMessage);
        } else if (errorMessage === translations?.error?.noFeeAddress) {
          console.error(errorMessage);
        } else if (errorMessage === translations?.error?.invalidTokenPrice) {
          console.error(errorMessage);
        }
      }
    } finally {
      setIsSending(false);
    }
  };

  const isCustomAmountActive = useMemo(() => {
    return (
      !!amount &&
      !contributionOptions.includes(parseFloat(amount)) &&
      parseFloat(amount) > 0
    );
  }, [amount]);

  if (!showContribution) {
    return null;
  }

  return (
    <ContributionWrapper showContribution={showContribution}>
      <DrawerWrapper ref={containerRef}>
        <Drawer
          open={showContribution}
          anchor="top"
          hideBackdrop={true}
          container={() => containerRef.current}
          sx={{ position: 'absolute' }}
          ModalProps={{
            disablePortal: true,
            disableEnforceFocus: true,
            disableAutoFocus: true,
          }}
          slotProps={{
            paper: {
              sx: {
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                width: '100%',
                borderRadius: '24px',
              },
            },
            backdrop: {
              sx: {
                position: 'absolute',
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust opacity as needed
                borderRadius: '24px',
              },
            },
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
                    selected={
                      !!amount && parseFloat(amount) === contributionAmount
                    }
                    onClick={() => handleButtonClick(contributionAmount)}
                    size="small"
                  >
                    ${contributionAmount}
                  </ContributionButton>
                </Grid>
              ))}
              <Grid size={3}>
                <ContributionCustomInput
                  value={inputAmount || ''}
                  aria-autocomplete="none"
                  onChange={onChangeValue}
                  onClick={handleCustom}
                  onFocus={handleCustom}
                  placeholder={translations.custom}
                  slotProps={{
                    root: {
                      sx: (theme) => ({
                        borderRadius: '16px',
                        width: '100%',
                        flexGrow: 1,
                        padding: 0,
                        maxWidth: '100%',
                        fieldset: {
                          border: 'none',
                        },
                      }),
                    },
                    input: {
                      startAdornment: inputAmount ? (
                        <InputAdornment
                          position="start"
                          disableTypography
                          sx={(theme) => ({
                            fontSize: '12px',
                            marginRight: 0,
                            lineHeight: '16px',
                            fontWeight: 700,
                            color: (theme.vars || theme).palette.text.primary,
                            ...(inputAmount && {
                              padding: 0,
                              // paddingLeft: '28px',
                            }),
                          })}
                        >
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

                        height: '32px',
                        borderRadius: '16px',
                        justifyContent: 'center',
                        ':focus': { padding: '0 12px 0 24px' }, // Added left padding for the $ symbol
                        fontSize: '12px',
                        lineHeight: '16px',
                        fontWeight: 700,
                        paddingLeft: 0,
                        textAlign: 'center',
                        transition: 'background-color 250ms',
                        color: (theme.vars || theme).palette.text.primary,

                        backgroundColor: isCustomAmountActive
                          ? 'rgba(101, 59, 163, 0.84)'
                          : (theme.vars || theme).palette.grey[200],
                        '&:hover': {
                          backgroundColor: isCustomAmountActive
                            ? '#653BA3'
                            : (theme.vars || theme).palette.grey[300],
                        },
                        ...theme.applyStyles('light', {
                          backgroundColor: isCustomAmountActive
                            ? '#F0E5FF'
                            : (theme.vars || theme).palette.grey[100],
                          '&:hover': {
                            backgroundColor: isCustomAmountActive
                              ? darken('#F0E5FF', 0.08)
                              : (theme.vars || theme).palette.grey[300],
                          },
                        }),
                      }),
                    },
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
        </Drawer>
      </DrawerWrapper>
    </ContributionWrapper>
  );
};

export default FeeContribution;
