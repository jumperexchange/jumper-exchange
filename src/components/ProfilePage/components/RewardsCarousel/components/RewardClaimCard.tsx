import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useTheme } from '@mui/material';
import type { BaseReward } from 'src/types/rewards';
import type { PortfolioBalance, WalletToken } from 'src/types/tokens';
import { useMemo, type FC } from 'react';
import { Link } from 'src/components/Link/Link';
import {
  RewardCardContainer,
  ClaimActionButton,
  ExplorerLinkButton,
  RewardCardActionsContainer,
} from './RewardClaimCard.style';
import { useBlockchainExplorerURL } from '@/hooks/useBlockchainExplorerURL';
import { REWARD_CLAIM_CARD_CONFIG } from './constants';
import { useTranslation } from 'react-i18next';
import { BalanceStackItem } from '@/components/composite/BalanceCard/components/BalanceStackItem';

interface RewardClaimCardProps {
  availableReward: BaseReward;
  balance: PortfolioBalance<WalletToken>;
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
  balance,
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
  const theme = useTheme();
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
