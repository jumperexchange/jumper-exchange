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
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { useTokens } from '@/hooks/useTokens';
import type { Address } from 'viem';
import { useBlockchainExplorerURL } from '@/hooks/useBlockchainExplorerURL';

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

  const totalPriceUSD = useMemo(() => {
    const token = getToken(
      availableReward.chainId,
      availableReward.address as Address,
    );
    return token?.priceUSD
      ? Number(token.priceUSD) * availableReward.amountToClaim
      : 0;
  }, [
    availableReward.chainId,
    availableReward.address,
    availableReward.amountToClaim,
    getToken,
  ]);

  return (
    <RewardCardContainer gap={2}>
      <TokenStackItem
        token={{
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
        }}
        config={{
          tokenSize: AvatarSize.LG,
          chainsSize: AvatarSize.XS,
          titleVariant: 'bodySmallStrong',
          descriptionVariant: 'bodyXSmall',
          infoContainerGap: 0,
          itemSx: {
            '&:not(:has([data-hint-hover-active]))': {
              '&:hover, &:focus-visible, &:focus': {
                backgroundColor: 'transparent',
              },
            },
          },
        }}
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
          size="large"
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
