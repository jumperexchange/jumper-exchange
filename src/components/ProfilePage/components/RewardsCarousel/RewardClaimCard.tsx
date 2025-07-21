import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useTheme } from '@mui/material';
import {
  useAccount,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';

import { MerklDistribABI } from 'src/const/abi/merklABI';
import { AvailableRewardsExtended } from 'src/types/merkl';
import { FC } from 'react';
import { Link } from 'src/components/Link';
import AvatarBadge from 'src/components/AvatarBadge/AvatarBadge';
import {
  RewardCardContainer,
  RewardAmountText,
  ClaimActionButton,
  ExplorerLinkButton,
} from './RewardClaimCard.style';
import { useTranslation } from 'react-i18next';

interface RewardClaimCardProps {
  availableReward: AvailableRewardsExtended;
}

export const RewardClaimCard: FC<RewardClaimCardProps> = ({
  availableReward,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { address } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const amount = availableReward.amountToClaim;

  const isLoading = isPending || isConfirming;
  const isZeroAmount = !amount || amount === 0;
  const isButtonDisabled = isLoading || isZeroAmount;

  const handleClaimClick = async () => {
    try {
      const { id } = await switchChainAsync({
        chainId: availableReward.chainId,
      });

      const canClaim =
        id === availableReward.chainId &&
        address &&
        availableReward.proof.length > 0 &&
        availableReward.amountToClaim > 0;

      if (!canClaim) return;

      writeContract({
        address: availableReward.claimingAddress as `0x${string}`,
        abi: MerklDistribABI,
        functionName: 'claim',
        args: [
          [address],
          [availableReward.address],
          [availableReward.accumulatedAmountForContractBN],
          [availableReward.proof],
        ],
      });
    } catch (err) {
      console.error('Error during claim:', err);
    }
  };

  return (
    <RewardCardContainer gap={2}>
      <AvatarBadge
        avatarSrc={availableReward.tokenLogo}
        badgeSrc={availableReward.chainLogo}
        avatarSize={40}
        badgeSize={16}
        badgeGap={4}
        badgeOffset={{ x: 5, y: 0 }}
        alt="token-logo"
        badgeAlt="chain-logo"
      />
      <RewardAmountText variant="titleSmall">
        {!address || amount === 0 || !amount || isConfirmed
          ? '0'
          : amount
            ? t('format.decimal2Digit', { value: amount })
            : '...'}
      </RewardAmountText>

      {!isConfirmed && (
        <ClaimActionButton
          isDisabled={isButtonDisabled}
          disabled={isButtonDisabled}
          loading={isLoading}
          loadingPosition="start"
          aria-label="Claim"
          size="large"
          onClick={handleClaimClick}
        >
          {isLoading ? 'Claiming' : 'Claim'}
        </ClaimActionButton>
      )}

      {hash && isConfirmed && (
        <Link
          href={`${availableReward.explorerLink}/tx/${hash}`}
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
