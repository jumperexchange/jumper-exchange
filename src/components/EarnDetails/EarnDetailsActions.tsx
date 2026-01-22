import { useAccount } from '@lifi/wallet-management';
import Typography from '@mui/material/Typography';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import type { EarnOpportunityExtended } from 'src/stores/depositFlow/DepositFlowStore';
import type { Hex } from 'viem';
import { useAccountAddress } from '@/hooks/earn/useAccountAddress';
import { useIsEarnUIFeatureDisabled } from '@/hooks/earn/useDisabledEarnUIFeatures';
import { usePortfolioDeFiPositions } from '@/hooks/portfolio/usePortfolioDeFiPositions';
import { useGetZapInPoolBalance } from '@/hooks/zaps/useGetZapInPoolBalance';
import { EarnInteractionFeature } from '@/types/earn';
import { ConnectButton } from '../ConnectButton';
import { DepositButtonDisplayMode } from '../composite/DepositButton/DepositButton.types';
import { DepositFlowButton } from '../composite/DepositFlow/DepositFlow';
import { WithdrawFlowButton } from '../composite/WithdrawFlow/WithdrawFlow';
import { EmptyComponent } from '../core/EmptyComponent/EmptyComponent';
import { BaseSurfaceSkeleton } from '../core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import { ExternalLink } from '../Link/ExternalLink';
import {
  EarnDetailsActionsButtonsContainer,
  EarnDetailsActionsButtonsFallbackContainer,
  EarnDetailsActionsContainer,
} from './EarnDetails.styles';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { EarnDetailsActionsPosition } from './EarnDetailsActionsPosition';
import { RequestRedeemFlowButton } from '../composite/RequestRedeemFlow/RequestRedeemFlow';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  useSwitchChain,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { makeClient } from '@/app/lib/client';
import { Badge } from '@/components/Badge/Badge';
import { BadgeVariant, BadgeSize } from '@/components/Badge/Badge.styles';
import { formatTokenAmount } from '@lifi/widget';
import { Button } from '@/components/Button/Button';

interface EarnDetailsActionsProps {
  earnOpportunity: EarnOpportunityExtended;
}

export const EarnDetailsActions = ({
  earnOpportunity,
}: EarnDetailsActionsProps) => {
  const { t } = useTranslation();
  const { account } = useAccount();
  const accountAddress = useAccountAddress();
  const theme = useTheme();
  const { switchChainAsync } = useSwitchChain();

  // Claim state management
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [currentActionIndex, setCurrentActionIndex] = useState(0);

  const isConnected = !!account?.address;

  const {
    isDisabled: isDepositFeatureDisabled,
    isLoading: isLoadingDepositFeatureDisabled,
  } = useIsEarnUIFeatureDisabled(
    EarnInteractionFeature.Deposit,
    earnOpportunity.interactionFlags,
  );
  const {
    isDisabled: isWithdrawFeatureDisabled,
    isLoading: isLoadingWithdrawFeatureDisabled,
  } = useIsEarnUIFeatureDisabled(
    EarnInteractionFeature.Withdraw,
    earnOpportunity.interactionFlags,
  );

  const {
    data: positionsData,
    isLoading: isLoadingPositions,
    refetch: refetchPositions,
  } = usePortfolioDeFiPositions({
    addresses: accountAddress ? [accountAddress] : [],
    filter: {
      earn: earnOpportunity.slug,
    },
  });

  const {
    depositTokenData: depositAmount,
    refetchDepositToken: refetchDepositAmount,
    isLoadingDepositTokenData: isLoadingDepositTokenData,
  } = useGetZapInPoolBalance(
    accountAddress,
    earnOpportunity.lpToken.address as Hex,
    earnOpportunity.lpToken.chain.chainId,
  );

  const depositAmountUSD = useMemo(() => {
    if (isLoadingPositions || !positionsData || !positionsData.data) {
      return undefined;
    }

    // If the deposit amount is defined, we don't need to use the positions data which might be outdated
    // The depositAmountUSD will be derived from the deposit amount
    if (isLoadingDepositTokenData || depositAmount !== undefined) {
      return undefined;
    }

    return positionsData.data[0]?.netUsd;
  }, [
    depositAmount,
    isLoadingDepositTokenData,
    positionsData,
    isLoadingPositions,
  ]);

  const hasDeposited = !!depositAmount || !!depositAmountUSD;
  const isLoading =
    isLoadingPositions ||
    isLoadingDepositTokenData ||
    isLoadingDepositFeatureDisabled ||
    isLoadingWithdrawFeatureDisabled;

  const areActionsDisabled =
    isDepositFeatureDisabled && isWithdrawFeatureDisabled;

  const {
    isSuccess,
    data: claims,
    refetch: refetchClaims,
  } = useQuery({
    queryKey: ['claims', accountAddress],
    queryFn: async () => {
      const client = makeClient();
      // Need to make sure that this refresh only every (1 day via the cache header)
      const data = await client.v1.earnControllerGetVaultSpecificDataV1(
        earnOpportunity.slug,
        { address: accountAddress as Hex },
      );
      return data.data;
    },
    enabled:
      !!accountAddress &&
      !!earnOpportunity.slug &&
      hasDeposited &&
      !earnOpportunity.isRedeemable,
  });

  // Fetch claim call data mutation
  const fetchClaimCallDataMutation = useMutation({
    mutationFn: async ({ amount }: { amount: string }) => {
      const client = makeClient();
      const { data } = await client.v1.earnControllerGetClaimRedeemCalldataV1(
        earnOpportunity.slug,
        {
          address: accountAddress as Hex,
          amount,
        },
      );
      return data.data;
    },
  });

  // Send transaction hook for executing claim transactions
  const {
    data: txHash,
    isPending: isWritePending,
    sendTransaction,
    reset: resetWrite,
  } = useSendTransaction();

  // Wait for transaction confirmation
  const {
    isLoading: isTxConfirming,
    isSuccess: isTxConfirmed,
    isError: isTxError,
    error: txError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
    confirmations: 1,
  });

  const executeClaimAction = useCallback(
    async (action: any) => {
      try {
        // Switch chain if needed
        if (account?.chainId !== action.tx.chainId) {
          await switchChainAsync({ chainId: action.tx.chainId });
        }

        // Execute the transaction
        sendTransaction({
          to: action.tx.to as Hex,
          data: action.tx.data as Hex,
          chainId: action.tx.chainId,
        });
      } catch (error) {
        console.error(`Failed to execute ${action.name}:`, error);
        setClaimingId(null);
        throw error;
      }
    },
    [account?.chainId, switchChainAsync, sendTransaction],
  );

  // Handle transaction errors
  useEffect(() => {
    if (!isTxError || !claimingId) {
      return;
    }

    // Log the transaction error
    console.error('Transaction failed:', txError);

    // Reset claiming state to allow retry
    setClaimingId(null);
    setCurrentActionIndex(0);
    resetWrite();
  }, [isTxError, txError, claimingId, resetWrite]);

  // Auto-execute transactions when confirmed
  useEffect(() => {
    if (!isTxConfirmed || !fetchClaimCallDataMutation.data || !claimingId) {
      return;
    }

    const callData = fetchClaimCallDataMutation.data;
    const nextIndex = currentActionIndex + 1;

    if (nextIndex < callData.actions.length) {
      // Move to next action
      setCurrentActionIndex(nextIndex);
      resetWrite();

      // Execute next action with proper error handling
      (async () => {
        try {
          await executeClaimAction(callData.actions[nextIndex]);
        } catch (error) {
          console.error('Failed to execute claim action:', error);
          // Reset state on error
          setClaimingId(null);
          setCurrentActionIndex(0);
          resetWrite();
        }
      })();
    } else {
      // All actions completed
      setClaimingId(null);
      setCurrentActionIndex(0);
      resetWrite();
      // Refetch claims data to remove the completed claim from the list
      refetchClaims();
    }
  }, [
    isTxConfirmed,
    fetchClaimCallDataMutation.data,
    claimingId,
    currentActionIndex,
    resetWrite,
    executeClaimAction,
    refetchClaims,
  ]);

  const handleClaim = async (claimId: string, amount: string) => {
    if (claimingId) {
      return; // Prevent multiple claims at once
    }

    setClaimingId(claimId);

    try {
      const callDataResult = await fetchClaimCallDataMutation.mutateAsync({
        amount,
      });

      if (!callDataResult?.actions || callDataResult.actions.length === 0) {
        throw new Error('No actions returned from claim call data');
      }

      // Reset and start with first action
      setCurrentActionIndex(0);
      const firstAction = callDataResult.actions[0];

      // Execute first action
      await executeClaimAction(firstAction);
    } catch (error) {
      console.error('Failed to start claim:', error);
      setClaimingId(null);
    }
  };

  const handleRefreshBalances = () => {
    refetchPositions();
    refetchDepositAmount();
    refetchClaims();
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ready':
        return BadgeVariant.Success;
      case 'pending':
        return BadgeVariant.Warning;
      case 'completed':
        return BadgeVariant.Default;
      default:
        return BadgeVariant.Default;
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const renderFooter = () => {
    if (!isConnected) {
      return (
        <EarnDetailsActionsButtonsFallbackContainer>
          <ConnectButton />
        </EarnDetailsActionsButtonsFallbackContainer>
      );
    }

    if (isLoading) {
      return (
        <EarnDetailsActionsButtonsContainer>
          <BaseSurfaceSkeleton
            variant="rounded"
            sx={(theme) => ({
              height: 48,
              width: '100%',
              borderRadius: theme.shape.buttonBorderRadius,
            })}
          />
        </EarnDetailsActionsButtonsContainer>
      );
    }

    if (areActionsDisabled) {
      return (
        <EarnDetailsActionsButtonsFallbackContainer>
          <Typography variant="bodyMediumParagraph" color="text.secondary">
            <Trans
              i18nKey="earn.position.disabled"
              values={{ protocolName: earnOpportunity.protocol.name }}
              components={[
                earnOpportunity.protocol.url ? (
                  <ExternalLink href={earnOpportunity.protocol.url} />
                ) : (
                  <EmptyComponent />
                ),
              ]}
            />
          </Typography>
        </EarnDetailsActionsButtonsFallbackContainer>
      );
    }
  };

  return (
    <>
      <EarnDetailsActionsContainer>
        <EarnDetailsActionsPosition
          token={earnOpportunity.lpToken}
          amountUSD={depositAmountUSD}
          amount={depositAmount}
        />
        {renderFooter()}
      </EarnDetailsActionsContainer>
      <EarnDetailsActionsButtonsContainer>
        <DepositFlowButton
          earnOpportunity={earnOpportunity}
          displayMode={DepositButtonDisplayMode.LabelOnly}
          size="large"
          label={t(hasDeposited ? 'buttons.deposit' : 'buttons.depositNow')}
          refetchCallback={handleRefreshBalances}
          data-testid="quick-deposit-button"
          sx={{ flex: 1 }}
        />
        {hasDeposited && earnOpportunity.isRedeemable && (
          <WithdrawFlowButton
            earnOpportunity={earnOpportunity}
            size="large"
            label={t('buttons.withdrawButtonLabel')}
            refetchCallback={handleRefreshBalances}
            data-testid="withdraw-button"
            sx={{ flex: 1 }}
          />
        )}
      </EarnDetailsActionsButtonsContainer>
      {hasDeposited && !earnOpportunity.isRedeemable && (
        <>
          <RequestRedeemFlowButton
            earnOpportunity={earnOpportunity}
            size="large"
            label={t('buttons.requestRedeemButtonLabel')}
            refetchCallback={handleRefreshBalances}
            data-testid="request-redeem-button"
            sx={{ flex: 1 }}
          />
          {isSuccess &&
            claims &&
            claims.data.claimData &&
            claims.data.claimData.length > 0 && (
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: '12px',
                  background: theme.vars.palette.surface2.main,
                  border: `1px solid ${theme.vars.palette.alpha100.main}`,
                }}
              >
                {/* Table Header */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr auto',
                    gap: 2,
                    pb: 2,
                    borderBottom: `1px solid ${theme.vars.palette.alpha100.main}`,
                  }}
                >
                  <Typography variant="bodyXXSmall" color="text.secondary">
                    {t('earn.claims.amount', 'Amount')}
                  </Typography>
                  <Typography variant="bodyXXSmall" color="text.secondary">
                    {t('earn.claims.date', 'Date')}
                  </Typography>
                  <Typography
                    variant="bodyXXSmall"
                    color="text.secondary"
                    sx={{ textAlign: 'right' }}
                  >
                    {t('earn.claims.status', 'Status')}
                  </Typography>
                  <Box sx={{ width: 80 }} />
                </Box>

                {/* Table Rows */}
                {claims.data.claimData.map((claim: any) => {
                  const isClaimable = claim.status.toLowerCase() === 'ready';
                  const isClaiming = claimingId === claim.id;

                  return (
                    <Box
                      key={claim.id}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr auto',
                        gap: 2,
                        py: 2,
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="bodySmall" sx={{ fontWeight: 600 }}>
                        {parseFloat(
                          formatTokenAmount(
                            BigInt(claim.assetAmount),
                            earnOpportunity.lpToken.decimals,
                          ),
                        ).toFixed(2)}{' '}
                        {earnOpportunity.lpToken.symbol}
                      </Typography>
                      <Typography variant="bodySmall" color="text.secondary">
                        {formatDate(claim.timestamp)}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Badge
                          variant={getStatusBadgeVariant(claim.status)}
                          size={BadgeSize.SM}
                          label={getStatusLabel(claim.status)}
                        />
                      </Box>
                      <Button
                        variant="primary"
                        size="small"
                        onClick={() => handleClaim(claim.id, claim.assetAmount)}
                        disabled={!isClaimable || isClaiming || !!claimingId}
                        loading={isClaiming}
                        styles={{
                          minWidth: 80,
                          py: 0.5,
                          fontSize: '14px',
                        }}
                      >
                        {isClaiming
                          ? t('earn.claims.claiming', 'Claiming...')
                          : t('earn.claims.claim', 'Claim')}
                      </Button>
                    </Box>
                  );
                })}
              </Box>
            )}
        </>
      )}
    </>
  );
};
