import { ChainType } from '@lifi/sdk';
import { useAccount } from '@lifi/wallet-management';
import CheckIcon from '@mui/icons-material/Check';
import { CircularProgress, darken, Drawer, Grid } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrackingAction, TrackingCategory } from 'src/const/trackingKeys';
import { useGetTokenBalance } from 'src/hooks/useGetTokenBalance';
import { useUserTracking } from 'src/hooks/userTracking/useUserTracking';
import { useTxHistory } from 'src/hooks/useTxHistory';
import { useRouteStore } from 'src/stores/route/RouteStore';
import { formatInputAmount } from 'src/utils/format';
import { parseUnits } from 'viem';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import {
  CONTRIBUTION_AB_TEST_PERCENTAGE,
  CONTRIBUTION_AMOUNTS,
  MIN_CONTRIBUTION_USD,
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
import { checkContributionByTxHistory, getContributionAmounts } from './utils';

type TranslationKey =
  | 'title'
  | 'contributionSent'
  | 'description'
  | 'custom'
  | 'confirm'
  | 'error.amountTooSmall';

export interface ContributionTranslations {
  title: string;
  contributionSent: string;
  description: string;
  custom: string;
  confirm: string;
  error: {
    amountTooSmall: string;
  };
}

export interface FeeContributionProps {
  translations?: Partial<ContributionTranslations>;
}

const FeeContribution: React.FC<FeeContributionProps> = ({ translations }) => {
  const { account } = useAccount();
  const { trackEvent } = useUserTracking();
  const { t } = useTranslation();
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [contributionAmounts, setContributionAmounts] = useState<number[]>(
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
  const [showContribution, setShowContribution] = useState(true);
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
    if (completedRoute?.fromAddress) {
      setAddress(completedRoute.fromAddress);
    }
  }, [completedRoute?.fromAddress]);

  // Check if contribution should be shown based on:
  // - Transaction history
  // - AB test
  // - Transaction amount >= $10
  // - Chain type is EVM
  useEffect(() => {
    if (
      !data?.transfers ||
      !completedRoute?.toAmountUSD ||
      !account?.chainType
    ) {
      return;
    }

    const txUsdAmount = Number(completedRoute.toAmountUSD);
    const isContributionEnabledByTxHistory = checkContributionByTxHistory(
      data.transfers,
    );
    const isEvmChain = account.chainType === ChainType.EVM;
    const isSameWallet =
      completedRoute.fromAddress === completedRoute.toAddress;
    const isWalletAccess = account.address === completedRoute.fromAddress;
    const isEligibleForContribution =
      txUsdAmount >= MIN_CONTRIBUTION_USD &&
      isSameWallet &&
      isWalletAccess &&
      isContributionAbEnabled &&
      isContributionEnabledByTxHistory &&
      isEvmChain;

    if (isEligibleForContribution) {
      // if contribution is enabled:
      // - based on chain type === EVM
      // - fromWallet === toWallet
      // - based on past tx´s
      // - and based on ab test
      // - and based on the contribution amount > 10 USD
      setShowContribution(true);
      setContributionAmounts(getContributionAmounts(txUsdAmount));
    }
  }, [
    data?.transfers,
    completedRoute?.toAmountUSD,
    account?.chainType,
    isContributionAbEnabled,
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

      // Note: The contribution should be sent to a dedicated wallet address, not the token contract address
      // Previously we were using the token contract address (completedRoute.toToken.address) which was incorrect
      // as that would try to send tokens to the token contract itself. Instead, we need to send to a wallet
      // that can receive and manage these contributions.
      const contributionWalletAddress = '0x...'; // TODO: Replace with actual contribution wallet address

      await writeContract({
        address: completedRoute.fromAddress as `0x${string}`, // todo: change to actual wallet address !
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
      if (
        error instanceof Error &&
        error.message === t('contribution.error.amountTooSmall')
      ) {
        alert(t('contribution.error.amountTooSmall'));
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

  // Use translations from props if provided, otherwise use i18n translations
  const getTranslation = (key: TranslationKey): string => {
    if (key === 'error.amountTooSmall') {
      return (
        translations?.error?.amountTooSmall ??
        t('contribution.error.amountTooSmall')
      );
    }
    const translationKey = `contribution.${key}` as const;
    return translations?.[key] ?? t(translationKey);
  };

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
            <ContributionCardTitle>
              {getTranslation('title')}
            </ContributionCardTitle>
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
                <ContributionCustomInput
                  value={inputAmount ? `$${inputAmount}` : ''}
                  aria-autocomplete="none"
                  onChange={onChangeValue}
                  onClick={handleCustom}
                  disableUnderline
                  placeholder={getTranslation('custom')}
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
              <ContributionButtonConfirm
                active={false}
                onClick={handleConfirm}
                isTxConfirmed={isTxConfirmed}
                disabled={isSending || isTxPending || isTxConfirming}
              >
                {isTxConfirmed ? <CheckIcon /> : null}
                {isSending || isTxPending || isTxConfirming ? (
                  <CircularProgress size={20} color="inherit" />
                ) : isTxConfirmed ? (
                  getTranslation('contributionSent')
                ) : (
                  getTranslation('confirm')
                )}
              </ContributionButtonConfirm>
            ) : (
              <ContributionDescription>
                {getTranslation('description')}
              </ContributionDescription>
            )}
          </ContributionCard>
        </Drawer>
      </DrawerWrapper>
    </ContributionWrapper>
  );
};

export default FeeContribution;
