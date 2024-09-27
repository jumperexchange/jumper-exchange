import { FlexCenterRowBox } from 'src/components/Superfest/SuperfestPage/SuperfestMissionPage.style';
import {
  ClaimButtonBox,
  RewardsCarouselMainBox,
  RewardsOpenIconButton,
} from '../RewardsCarousel.style';
import { RewardsAmountBox } from '../RewardsAmountBox/RewardsAmountBox';
import { Button } from 'src/components/Button';
import { Typography, useTheme } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import type { AvailableRewards } from 'src/hooks/useMerklRewardsOnCampaigns';
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useSwitchChain,
} from 'wagmi';
import { ChainId } from '@lifi/types';
import { MerklDistribABI } from 'src/const/abi/merklABI';

interface ClaimRewardParams {
  tokenChainid: number;
  proof: string[];
  rewardAmount: number;
  rewardToken: string;
  rewardAmountBN: string;
  claimingAddress: `0x${string}`;
}

interface ClaimingBoxProps {
  amount: number;
  availableReward: AvailableRewards;
}

export const ClaimingBox = ({ amount, availableReward }: ClaimingBoxProps) => {
  const theme = useTheme();
  const { address } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  async function handleClick({
    tokenChainid,
    proof,
    rewardAmount,
    rewardToken,
    rewardAmountBN,
    claimingAddress,
  }: ClaimRewardParams) {
    try {
      const { id } = await switchChainAsync({
        chainId: tokenChainid,
      });

      const canClaim =
        id === tokenChainid && address && proof && rewardAmount > 0;

      if (canClaim) {
        writeContract({
          address: claimingAddress,
          abi: MerklDistribABI,
          functionName: 'claim',
          args: [[address], [rewardToken], [rewardAmountBN], [proof]], //   function claim(address[] calldata users, address[] calldata tokens, uint256[] calldata amounts, bytes32[][] calldata proofs)
          // TESTING
          // args: [
          //   [address],
          //   [TEST_TOKEN],
          //   [accumulatedAmountForContractBN],
          //   [proof],
          // ], //   function claim(address[] calldata users, address[] calldata tokens, uint256[] calldata amounts, bytes32[][] calldata proofs)
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <RewardsCarouselMainBox marginTop={'8px'}>
      <FlexCenterRowBox>
        <RewardsAmountBox
          rewardAmount={amount}
          isConfirmed={isConfirmed}
          tokenLogo={availableReward.tokenLogo}
          chainLogo={availableReward.chainLogo}
          decimalsToShow={availableReward.decimalsToShow}
        />
      </FlexCenterRowBox>
      {isConfirmed ? null : (
        <ClaimButtonBox>
          <Button
            disabled={
              isPending || isConfirming || (!!amount && amount === 0) || !amount
            }
            variant="secondary"
            aria-label="Claim"
            size="large"
            styles={{
              opacity:
                isPending ||
                isConfirming ||
                (!!amount && amount === 0) ||
                !amount
                  ? 0.3
                  : undefined,
              alignItems: 'center',
              padding: '16px',
              width: '100%',
            }}
            onClick={() =>
              handleClick({
                tokenChainid: availableReward.chainId,
                proof: availableReward.proof,
                rewardAmount: availableReward.amountToClaim,
                rewardAmountBN: availableReward.accumulatedAmountForContractBN,
                rewardToken: availableReward.address,
                claimingAddress:
                  availableReward.claimingAddress as `0x${string}`,
              })
            }
          >
            <Typography
              fontSize="14px"
              lineHeight="18px"
              fontWeight={700}
              color={theme.palette.text.primary}
            >
              {isPending || isConfirming ? 'Claiming...' : 'Claim'}
            </Typography>
          </Button>
        </ClaimButtonBox>
      )}
      {hash && isConfirmed ? (
        <a
          href={`${availableReward.explorerLink}/tx/${hash}`}
          target="_blank"
          style={{
            textDecoration: 'none',
            color: 'inherit',
            marginLeft: '32px',
          }}
          rel="noreferrer"
        >
          <RewardsOpenIconButton>
            <OpenInNewIcon
              sx={{
                height: '32px',
                color: theme.palette.white.main,
              }}
            />
          </RewardsOpenIconButton>
        </a>
      ) : undefined}
    </RewardsCarouselMainBox>
  );
};
