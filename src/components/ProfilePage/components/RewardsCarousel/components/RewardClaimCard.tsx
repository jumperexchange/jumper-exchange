import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useTheme } from '@mui/material';
import type { BaseReward } from 'src/types/rewards';
import { useMemo, type FC } from 'react';
import { Link } from 'src/components/Link';
import {
  RewardCardContainer,
  ClaimActionButton,
  ExplorerLinkButton,
} from './RewardClaimCard.style';
import { TokenStackItem } from '@/components/composite/TokenListCard/TokenStackItem';
import { useTokens } from '@/hooks/useTokens';
import type { Address } from 'viem';
import { useBlockchainExplorerURL } from '@/hooks/useBlockchainExplorerURL';
import { REWARD_CLAIM_CARD_CONFIG } from './constants';

interface RewardClaimCardProps {
  availableReward: BaseReward;
  onClaim: () => void;
  isLoading: boolean;
  isDisabled: boolean;
  isConfirmed: boolean;
  hash: string | undefined;
}

export const RewardClaimCard: FC<RewardClaimCardProps> = ({
  availableReward,
  onClaim,
  isLoading,
  isDisabled,
  isConfirmed,
  hash,
}) => {
  const theme = useTheme();
  const { getToken } = useTokens();
  const explorerLink = useBlockchainExplorerURL(
    availableReward.chainId,
    hash,
    'tx',
  );

  const token = useMemo(() => {
    const _token = getToken(
      availableReward.chainId,
      availableReward.address as Address,
    );
    const totalPriceUSD = _token?.priceUSD
      ? Number(_token.priceUSD) * availableReward.amountToClaim
      : 0;
    return {
      address: availableReward.address,
      logo: availableReward.logoURI,
      name: availableReward.symbol,
      symbol: availableReward.symbol,
      decimals: availableReward.tokenDecimals,
      chain: {
        chainId: availableReward.chainId,
        chainKey: availableReward.chainId.toString(),
      },
      balance: availableReward.amountToClaim,
      totalPriceUSD,
    };
  }, [availableReward, getToken]);

  return (
    <RewardCardContainer gap={2}>
      <TokenStackItem
        token={token}
        config={REWARD_CLAIM_CARD_CONFIG}
        chainsLimit={1}
        chainsSpacing={0}
        isClickable={false}
      />

      {!isConfirmed && (
        <ClaimActionButton
          isDisabled={isDisabled}
          disabled={isDisabled}
          loading={isLoading}
          loadingPosition="start"
          aria-label="Claim"
          size="medium"
          onClick={onClaim}
        >
          {isLoading ? 'Claiming' : 'Claim'}
        </ClaimActionButton>
      )}

      {hash && isConfirmed && explorerLink && (
        <Link
          href={explorerLink}
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <ExplorerLinkButton>
            <OpenInNewIcon
              sx={{ height: '32px', color: theme.palette.white.main }}
            />
          </ExplorerLinkButton>
        </Link>
      )}
    </RewardCardContainer>
  );
};
