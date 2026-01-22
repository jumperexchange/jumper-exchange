import type { FC } from 'react';
import { useMemo, useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import type { ModalContainerProps } from 'src/components/core/modals/ModalContainer/ModalContainer';
import { ModalContainer } from 'src/components/core/modals/ModalContainer/ModalContainer';
import { useTranslation } from 'react-i18next';
import { useAccount } from '@lifi/wallet-management';
import { useMutation } from '@tanstack/react-query';
import {
  useSwitchChain,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi';
import type { EarnOpportunityExtended } from '@/stores/requestRedeemFlow/RequestRedeemFlowStore';
import { SelectCardInput } from '@/components/Cards/SelectCard/mode/SelectCardInput';
import { SelectCardMode } from '@/components/Cards/SelectCard/SelectCard.styles';
import { Button } from '@/components/Button/Button';
import { useGetZapInPoolBalance } from '@/hooks/zaps/useGetZapInPoolBalance';
import type { Hex } from 'viem';
import { useAccountAddress } from '@/hooks/earn/useAccountAddress';
import { useToken } from '@/hooks/useToken';
import { formatTokenAmount, formatTokenPrice, priceToTokenAmount } from '@lifi/widget';
import { currencyFormatter } from '@/utils/formatNumbers';
import { makeClient } from '@/app/lib/client';

interface RequestRedeemModalProps extends ModalContainerProps {
  earnOpportunity: EarnOpportunityExtended;
  refetchCallback?: () => void;
}

const formatUSD = currencyFormatter('en-US', {
  notation: 'compact',
  currency: 'USD',
  useGrouping: true,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const RequestRedeemModal: FC<RequestRedeemModalProps> = ({
  onClose,
  isOpen,
  earnOpportunity,
  refetchCallback,
}) => {
  // TODO: Will need to be refactorized depending of the design
  const accountAddress = useAccountAddress();

  const {
    depositTokenData: amount,
  } = useGetZapInPoolBalance(
    accountAddress as Hex,
    earnOpportunity.lpToken.address as Hex,
    earnOpportunity.lpToken.chain.chainId,
  );
  const token = earnOpportunity.lpToken;

  // IMPORTANT: We use the useToken hook to get the token data instead of the useTokens hook as the override is only present on /token for now
  const { token: tokenData } = useToken(
    token.chain.chainId,
    token.address as Hex,
    { extended: true },
  );

  const priceUSD = tokenData?.priceUSD ?? '0';
  const hasPriceUSD = Number(priceUSD) > 0;

  const { formattedAmount, formattedAmountUSD, hasAmount } = useMemo(() => {
    const calculateTokenAmount = (): string => {
      if (amount) {
        return formatTokenAmount(BigInt(amount), token.decimals);
      }
      return '0';
    };

    const calculateAmountUSD = (): number => {
      if (amount && hasPriceUSD) {
        const formattedTokenAmount = formatTokenAmount(
          BigInt(amount),
          token.decimals,
        );
        return formatTokenPrice(formattedTokenAmount, priceUSD);
      }
      return 0;
    };

    const computedAmount = calculateTokenAmount();
    const computedAmountUSD = calculateAmountUSD();
    const hasAmount = computedAmount !== '0' || computedAmountUSD !== 0;

    return {
      formattedAmount: `${computedAmount} ${token.symbol ?? ''}`,
      formattedAmountUSD: formatUSD(computedAmountUSD),
      hasAmount,
    };
  }, [
    amount,
    token.decimals,
    token.symbol,
    hasPriceUSD,
    priceUSD,
  ]);

  const { t } = useTranslation();
  const theme = useTheme();
  const { account } = useAccount();
  const [currentStep, setCurrentStep] = useState<'idle' | 'fetching' | 'approving' | 'requesting' | 'success'>('idle');
  const [currentActionIndex, setCurrentActionIndex] = useState(0);
  const { switchChainAsync } = useSwitchChain();

  // Fetch call data mutation
  const fetchCallDataMutation = useMutation({
    mutationFn: async () => {
      const client = makeClient();
      const { data } = await client.v1.earnControllerGetRequestRedeemCallDataV1(earnOpportunity.slug, {
        address: accountAddress as Hex,
        amount: amount?.toString() ?? '0',
      });
      return data.data;
    },
  });

  // Send transaction hook for executing transactions
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
  } = useWaitForTransactionReceipt({
    hash: txHash,
    confirmations: 1,
  });

  const executeAction = useCallback(async (action: any) => {
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
      setCurrentStep('idle');
      throw error;
    }
  }, [account?.chainId, switchChainAsync, sendTransaction]);

  // Auto-execute transactions when confirmed
  useEffect(() => {
    if (!isTxConfirmed || !fetchCallDataMutation.data) {
      return;
    }

    const callData = fetchCallDataMutation.data;
    const nextIndex = currentActionIndex + 1;

    if (nextIndex < callData.actions.length) {
      // Move to next action
      setCurrentActionIndex(nextIndex);
      resetWrite();

      // Execute next action with proper error handling
      (async () => {
        try {
          await executeAction(callData.actions[nextIndex]);
        } catch (error) {
          console.error('Failed to execute action:', error);
          // Reset state on error
          setCurrentStep('idle');
          setCurrentActionIndex(0);
          resetWrite();
        }
      })();
    } else {
      // All actions completed
      setCurrentStep('success');
      resetWrite();
      // Refetch vault-specific-data to update claims
      if (refetchCallback) {
        refetchCallback();
      }
    }
  }, [isTxConfirmed, fetchCallDataMutation.data, currentActionIndex, resetWrite, executeAction, refetchCallback]);

  const handleSubmit = async () => {
    if (!accountAddress) {
      console.error('No wallet connected');
      return;
    }
    if (currentStep !== 'idle') {
      return; // Prevent multiple submissions
    }

    // Fetch call data first
    setCurrentStep('fetching');

    try {
      const callDataResult = await fetchCallDataMutation.mutateAsync();
      if (!callDataResult?.actions || callDataResult.actions.length === 0) {
        throw new Error('No actions returned from call data');
      }

      // Reset and start with first action
      setCurrentActionIndex(0);
      const firstAction = callDataResult.actions[0];

      // Set appropriate step based on first action
      if (firstAction.name.toLowerCase().includes('approve')) {
        setCurrentStep('approving');
      } else {
        setCurrentStep('requesting');
      }

      // Execute first action
      await executeAction(firstAction);
    } catch (error) {
      console.error('Failed to start redeem request:', error);
      setCurrentStep('idle');
    }
  };

  const isLoading =
    (currentStep !== 'idle' && currentStep !== 'success') ||
    isWritePending ||
    isTxConfirming;

  const isDisabled = !accountAddress || !hasAmount || isLoading;
  const getButtonText = () => {
    if (!accountAddress) {
      return t('earn.requestRedeem.connectWallet', 'Connect Wallet');
    }
    if (currentStep === 'success') {
      return t('earn.requestRedeem.success', 'Success!');
    }
    if (currentStep === 'fetching') {
      return t('earn.requestRedeem.preparingTransaction', 'Preparing...');
    }
    if (currentStep === 'approving') {
      if (isTxConfirming) {
        return t('earn.requestRedeem.confirmingApproval', 'Confirming approval...');
      }
      return t('earn.requestRedeem.approving', 'Approving...');
    }
    if (currentStep === 'requesting') {
      if (isTxConfirming) {
        return t('earn.requestRedeem.confirmingRequest', 'Confirming request...');
      }
      return t('earn.requestRedeem.requesting', 'Requesting...');
    }
    return t('earn.requestRedeem.button', 'Request Redeem');
  };

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          p: 4,
          maxWidth: 456,
          width: '100%',
          borderRadius: '24px',
          background: theme.vars.palette.background.default,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${theme.palette.mode === 'dark'
            ? 'rgba(139, 92, 246, 0.2)'
            : 'rgba(79, 70, 229, 0.15)'
          }`,
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 32px rgba(0, 0, 0, 0.4)'
            : '0 8px 32px rgba(0, 0, 0, 0.1)',
          [theme.breakpoints.down('sm')]: {
            maxWidth: '100%',
            borderRadius: '24px 24px 0 0',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          },
        }}
      >
        {/* Title */}
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 700,
            color: theme.vars.palette.text.primary,
          }}
        >
          {t('earn.requestRedeem.title', 'Request Redeem')}
        </Typography>

        {/* Amount section */}
        <Box>
          <Typography
            variant="bodySmallStrong"
            sx={{
              mb: 1.5,
              color: theme.vars.palette.text.primary,
            }}
          >
            {t('earn.requestRedeem.amount', 'Amount')}
          </Typography>
          <SelectCardInput
            mode={SelectCardMode.Input}
            id="redeem-amount"
            name="amount"
            value={formattedAmount}
            placeholder="0"
            description={formattedAmountUSD}
            isAmount
            sx={{
              background: theme.vars.palette.background.paper,
            }}
          />
        </Box>

        {/* Submit Button */}
        <Button
          variant="primary"
          fullWidth
          size="large"
          onClick={handleSubmit}
          disabled={isDisabled}
          loading={isLoading}
          styles={{
            py: 2,
            fontSize: '18px',
            fontWeight: 700,
          }}
        >
          {getButtonText()}
        </Button>
      </Box>
    </ModalContainer>
  );
};
