import { ChainType } from '@lifi/sdk';
import { useAccount } from '@lifi/wallet-management';
import CheckIcon from '@mui/icons-material/Check';
import {
  Box,
  Card,
  CircularProgress,
  darken,
  Drawer,
  Grid,
  Input,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrackingAction, TrackingCategory } from 'src/const/trackingKeys';
import { useGetTokenBalance } from 'src/hooks/useGetTokenBalance';
import { useUserTracking } from 'src/hooks/userTracking/useUserTracking';
import { Transfer, useTxHistory } from 'src/hooks/useTxHistory';
import { useRouteStore } from 'src/stores/route/RouteStore';
import { formatInputAmount } from 'src/utils/format';
import { parseUnits } from 'viem';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { ContributionButton } from './FeeContribution.style';

const checkContributionByTxHistory = (
  transfers: Transfer[] | undefined,
): boolean => {
  const transactionCount = transfers?.length ?? 0;
  return (
    transactionCount === 0 ||
    (transactionCount > 0 && transactionCount % 3 === 0)
  );
};

const DEFAULT_CONTRIBUTION_AMOUNTS = [0.5, 1, 2];

const getContributionAmounts = (volume: number) => {
  if (volume >= 100000) {
    return [5, 10, 15];
  } else if (volume >= 10000) {
    return [2, 10, 15];
  } else if (volume >= 1000) {
    return [1, 5, 10];
  } else {
    return DEFAULT_CONTRIBUTION_AMOUNTS;
  }
};

const FeeContribution = () => {
  const { account } = useAccount();
  const { trackEvent } = useUserTracking();
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [contributionAmounts, setContributionAmounts] = useState<number[]>(
    DEFAULT_CONTRIBUTION_AMOUNTS,
  );
  // Show Contribution for ~10% of users
  const isContributionAbEnabled = useMemo(() => {
    return Math.random() < 0.1;
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
  const { t } = useTranslation();

  function onChangeValue(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    // Remove dollar sign if present and format the amount
    const valueWithoutDollar = value.replace('$', '');

    // Calculate max amount in USD based on token balance
    const maxTokenAmount = tokenBalanceData
      ? Number(tokenBalanceData.amount) /
        Math.pow(10, tokenBalanceData.decimals)
      : 0;
    const maxUsdAmount =
      maxTokenAmount * Number(completedRoute?.toToken?.priceUSD || 0);
    const formattedAmount = formatInputAmount(
      valueWithoutDollar,
      2,
      false,
      maxUsdAmount,
    );
    setInputAmount(formattedAmount);
    setAmount(formattedAmount);
  }

  // Set the address of the user from last tx
  useEffect(() => {
    setAddress(completedRoute?.fromAddress);
  }, [completedRoute]);

  // Check if contribution is enabled
  useEffect(() => {
    if (data?.transfers) {
      const isContributionEnabledByTxHistory = checkContributionByTxHistory(
        data.transfers,
      );
      const txUsdAmount = Number(completedRoute?.toAmountUSD || 0);
      if (
        txUsdAmount >= 10 &&
        isContributionAbEnabled &&
        isContributionEnabledByTxHistory &&
        account?.chainType === ChainType.EVM
      ) {
        // if contribution is enabled:
        // - based on chain type === EVM
        // - based on past tx´s
        // - and based on ab test
        // - and based on the contribution amount > 10 USD
        setShowContribution(true);
        setContributionAmounts(getContributionAmounts(txUsdAmount));
      }
    }
  }, [data]);

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
        throw new Error('Invalid token price');

      const usdAmount = parseFloat(amount);
      // Use token's actual decimals for precision
      const tokenAmount = (usdAmount / tokenPriceUSD).toFixed(
        completedRoute.toToken.decimals,
      );

      // Ensure we have a non-zero amount after conversion
      if (parseFloat(tokenAmount) === 0) {
        throw new Error(t('contribution.error.amountTooSmall'));
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

      await writeContract({
        address: completedRoute.toToken.address as `0x${string}`, // todo: change to actual wallet address !
        abi: [
          {
            name: 'transfer',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [
              { name: 'to', type: 'address' },
              { name: 'amount', type: 'uint256' },
            ],
            outputs: [{ name: '', type: 'bool' }],
          },
        ],
        functionName: 'transfer',
        args: [account.address as `0x${string}`, amountInTokenUnits],
        chainId: completedRoute.toChainId,
      });
    } catch (error) {
      console.error('Error sending contribution:', error);
      // Add user-friendly error message
      if (
        error instanceof Error &&
        error.message === 'Amount too small for this token'
      ) {
        alert(
          'The contribution amount is too small for this token. Please try a larger amount.',
        );
      }
    } finally {
      setIsSending(false);
    }
  };

  const isCustomActive = useMemo(() => {
    return (
      !!amount &&
      !contributionAmounts.includes(parseFloat(amount)) &&
      parseFloat(amount) > 0
    );
  }, [amount]);

  if (!showContribution) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'relative',
        transition: 'height 250ms',
        height: showContribution ? '156px' : '0px',
      }}
    >
      <Box
        ref={containerRef}
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
          overflow: 'hidden',
          borderRadius: '24px',
        }}
      >
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
          <Card
            sx={(theme) => ({
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing(2),
              border: 'unset',
              padding: theme.spacing(2),
              borderRadius: '16px',
              boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.04)',
            })}
          >
            <Typography
              sx={{ fontSize: '14px', lineHeight: '20px', fontWeight: 700 }}
            >
              {t('contribution.title')}
            </Typography>
            <Grid
              container
              spacing={2}
              columnSpacing={1}
              justifyContent={'space-between'}
            >
              {contributionAmounts.map((contributionAmount) => (
                <Grid size={3} key={contributionAmount}>
                  <ContributionButton
                    active={
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
                <Input
                  value={inputAmount ? `$${inputAmount}` : ''}
                  aria-autocomplete="none"
                  onChange={onChangeValue}
                  onClick={handleCustom}
                  disableUnderline
                  placeholder={t('contribution.custom')}
                  sx={(theme) => ({
                    height: '32px',
                    '& .MuiInputBase-input::placeholder': {
                      color: theme.palette.text.primary,
                      opacity: 1,
                      textAlign: 'center',
                    },
                  })}
                  slotProps={{
                    input: {
                      sx: (theme) => ({
                        height: '32px',
                        border: 'none',
                        borderRadius: '16px',
                        padding: 0,
                        fontSize: '12px',
                        lineHeight: '16px',
                        fontWeight: 700,
                        textAlign: 'center',
                        backgroundColor: isCustomActive
                          ? '#F0E5FF'
                          : theme.palette.grey[100],
                        color: theme.palette.text.primary,
                        transition: 'background-color 250ms',
                        '&:hover': {
                          backgroundColor: isCustomActive
                            ? darken('#F0E5FF', 0.04)
                            : theme.palette.grey[300],
                        },
                      }),
                    },
                  }}
                />
              </Grid>
            </Grid>

            {!!amount ? (
              <ContributionButton
                active={false}
                onClick={handleConfirm}
                disabled={isSending || isTxPending || isTxConfirming}
                sx={() => ({
                  height: '40px',
                  fontSize: '14px',
                  lineHeight: '16px',
                  fontWeight: 700,
                  gap: '8px',
                  ...(isTxConfirmed && {
                    backgroundColor: '#D6FFE7',
                    color: '#00B849',
                    '&:hover': {
                      backgroundColor: darken('#D6FFE7', 0.04),
                    },
                  }),
                })}
              >
                {isTxConfirmed ? <CheckIcon /> : null}
                {isSending || isTxPending || isTxConfirming ? (
                  <CircularProgress size={20} color="inherit" />
                ) : isTxConfirmed ? (
                  t('contribution.contributionSent')
                ) : (
                  t('contribution.confirm')
                )}
              </ContributionButton>
            ) : (
              <Typography
                sx={(theme) => ({
                  fontSize: '12px',
                  lineHeight: '16px',
                  fontWeight: 500,
                  color: theme.palette.grey[700],
                })}
              >
                {t('contribution.description')}
              </Typography>
            )}
          </Card>
        </Drawer>
      </Box>
    </Box>
  );
};

export default FeeContribution;
