import { Route } from '@lifi/sdk';
import { Account } from '@lifi/wallet-management';
import CheckIcon from '@mui/icons-material/Check';
import CircularProgress from '@mui/material/CircularProgress';
import * as Sentry from '@sentry/nextjs';
import { TrackingAction, TrackingCategory } from 'src/const/trackingKeys';
import { DEFAULT_WALLET_ADDRESS } from 'src/const/urls';
import { useUserTracking } from 'src/hooks/userTracking';
import {
  createNativeTransactionConfig,
  createTokenTransactionConfig,
} from 'src/utils/transaction';
import { parseUnits } from 'viem';
import { Config } from 'wagmi';
import { SendTransactionMutate, WriteContractMutate } from 'wagmi/query';
import { FeeContributionCardProps } from './FeeContribution';
import { ContributionButtonConfirm } from './FeeContribution.style';
import { getContributionFeeAddress } from './utils';

interface FeeContributionCTAProps
  extends Pick<
    FeeContributionCardProps,
    'contributed' | 'isTransactionLoading' | 'translationFn'
  > {
  completedRoute: Route | null;
  setIsSending: (isSending: boolean) => void;
  setIsOpen: (isOpen: boolean) => void;
  isTxConfirmed: boolean;
  isNativeTxSuccess: boolean;
  amount: string;
  account: Account;
  sendTransaction: SendTransactionMutate<Config, unknown>;
  writeContract: WriteContractMutate<Config, unknown>;
}

export const FeeContributionCTA: React.FC<FeeContributionCTAProps> = ({
  translationFn,
  contributed,
  isTransactionLoading,
  setIsSending,
  setIsOpen,
  isTxConfirmed,
  isNativeTxSuccess,
  amount,
  completedRoute,
  account,
  writeContract,
  sendTransaction,
}) => {
  const { trackEvent } = useUserTracking();

  // Handle contribution confirmation to sign the tx
  const handleConfirm = async () => {
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

  return (
    <ContributionButtonConfirm
      disabled={isTransactionLoading && !contributed}
      isTxConfirmed={contributed}
      onClick={handleConfirm}
    >
      {contributed ? <CheckIcon /> : null}
      {isTransactionLoading ? (
        <CircularProgress size={20} color="inherit" />
      ) : contributed ? (
        translationFn('contribution.thankYou')
      ) : (
        translationFn('contribution.confirm')
      )}
    </ContributionButtonConfirm>
  );
};
