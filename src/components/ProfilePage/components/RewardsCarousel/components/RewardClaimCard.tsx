import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useTheme } from '@mui/material';
import type { BaseReward } from 'src/types/rewards';
import { useMemo, type FC } from 'react';
import { Link } from 'src/components/Link/Link';
import {
  RewardCardContainer,
  ClaimActionButton,
  ExplorerLinkButton,
  RewardCardActionsContainer,
} from './RewardClaimCard.style';
import { useTokens } from '@/hooks/useTokens';
import type { Address } from 'viem';
import { useBlockchainExplorerURL } from '@/hooks/useBlockchainExplorerURL';
import {
  CLAIMABLE_MIN_AMOUNT_USD,
  REWARD_CLAIM_CARD_CONFIG,
} from './constants';
import { useTranslation } from 'react-i18next';
import { BalanceStackItem } from '@/components/composite/BalanceCard/components/BalanceStackItem';
import { createWalletToken } from '@/types/tokens';
import { useTokenAmountInput } from '@/hooks/tokens/useTokenAmountInput';

interface RewardClaimCardProps {
  availableReward: BaseReward;
  onClaim: () => void;
  isLoading: boolean;
  isDisabled: boolean;
  isConfirmed: boolean;
  isError: boolean;
  hash: string | undefined;
  hasPendingTx?: boolean;
  isPendingValidation?: boolean;
}

export const RewardClaimCard: FC<RewardClaimCardProps> = ({
  availableReward,
  onClaim,
  isLoading,
  isDisabled,
  isConfirmed,
  isError,
  hash,
  hasPendingTx = false,
  isPendingValidation = false,
}) => {
  const { t } = useTranslation();
  const { toRawAmount } = useTokenAmountInput();
  const theme = useTheme();
  const { getToken } = useTokens();
  const explorerLink = useBlockchainExplorerURL(
    availableReward.chainId,
    hash,
    'tx',
  );

  const isFinalized = !!hash && (isConfirmed || isError);
  const showLinkForPending = hasPendingTx && !!explorerLink;
  const showClaimButton =
    (!isConfirmed || isError) && !(hasPendingTx && isPendingValidation);
  const showExplorerLink =
    !isLoading && (isFinalized || showLinkForPending) && !!explorerLink;

  const claimButtonLabel = useMemo(() => {
    if (isLoading) {
      return t('profile_page.rewardsClaim.action.claiming');
    }
    if (isError) {
      return t('profile_page.rewardsClaim.action.retry');
    }
    return t('profile_page.rewardsClaim.action.claim');
  }, [isLoading, isError, t]);

  const balance = useMemo(() => {
    const _token = getToken(
      availableReward.chainId,
      availableReward.address as Address,
    );

    const priceUSD = _token?.priceUSD ?? '0';

    const _walletToken = createWalletToken({
      address: availableReward.address,
      logoURI: availableReward.logoURI,
      name: availableReward.symbol,
      symbol: availableReward.symbol,
      decimals: availableReward.tokenDecimals,
      chainId: availableReward.chainId,
      chainKey: availableReward.chainId.toString(),
      priceUSD: priceUSD,
    });

    const amount = availableReward.amountToClaim;
    const amountUSD = amount * Number(priceUSD);
    const amountStr = amount.toFixed(availableReward.tokenDecimals);

    return {
      token: _walletToken,
      amountUSD,
      amount: toRawAmount(amountStr, availableReward.tokenDecimals),
    };
  }, [availableReward, getToken, toRawAmount]);

  if (balance.amountUSD < CLAIMABLE_MIN_AMOUNT_USD) {
    return null;
  }

  return (
    <RewardCardContainer sx={{ gap: 2 }}>
      <BalanceStackItem
        balance={balance}
        config={REWARD_CLAIM_CARD_CONFIG}
        isClickable={false}
      />

      <RewardCardActionsContainer>
        {showClaimButton && (
          <ClaimActionButton
            isDisabled={isDisabled}
            disabled={isDisabled}
            loading={isLoading}
            loadingPosition="start"
            aria-label="Claim"
            size="medium"
            onClick={onClaim}
          >
            {claimButtonLabel}
          </ClaimActionButton>
        )}

        {showExplorerLink && (
          <Link
            href={explorerLink}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <ExplorerLinkButton>
              <OpenInNewIcon
                sx={{ width: 20, height: 20, color: theme.palette.white.main }}
              />
            </ExplorerLinkButton>
          </Link>
        )}
      </RewardCardActionsContainer>
    </RewardCardContainer>
  );
};
