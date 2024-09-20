import { Box, Typography, useTheme } from '@mui/material';
import {
  RewardsCarouselContainer,
  RewardsCarouselMainBox,
  ClaimButtonBox,
  EarnedTypography,
  RewardsOpenIconButton,
} from './RewardsCarousel.style';
import { RewardsAmountBox } from './RewardsAmountBox/RewardsAmountBox';
import { Button } from 'src/components/Button';
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useSwitchChain,
} from 'wagmi';
import { ChainId } from '@lifi/types';
import { MerklDistribABI } from '../../../const/abi/merklABI';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { FlexCenterRowBox } from 'src/components/Superfest/SuperfestPage/SuperfestMissionPage.style';
import { AvailableRewards } from 'src/hooks/useMerklRewardsOnSpecificToken';

interface RewardsCarouselProps {
  isMerklSuccess: boolean;
  hideComponent: boolean;
  availableRewards: AvailableRewards[];
}

interface ClaimRewardParams {
  tokenChainid: number;
  proof: string[];
  rewardAmount: number;
  rewardToken: string;
  rewardAmountBN: string;
  claimingAddress: `0x${string}`;
}

// const CLAIMING_CONTRACT_ADDRESS = REWARD_CLAIMING_ADDRESS;
// const REWARD_TOKEN = REWARD_TOKEN_ADDRESS;
// -------
//TESTING
// const TEST_TOKEN = '0x41A65AAE5d1C8437288d5a29B4D049897572758E';

export const RewardsCarousel = ({
  hideComponent,
  availableRewards,
  isMerklSuccess,
}: RewardsCarouselProps) => {
  const { address } = useAccount();
  const theme = useTheme();
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
        id === tokenChainid &&
        address &&
        isMerklSuccess &&
        proof &&
        rewardAmount > 0;

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
    <>
      {!hideComponent ? (
        <RewardsCarouselContainer>
          {availableRewards.map((availableReward) => {
            const amount = availableReward.amountToClaim;
            return (
              <RewardsCarouselMainBox>
                <FlexCenterRowBox>
                  <Box>
                    <EarnedTypography
                      color={
                        theme.palette.mode === 'dark' ? '#ffffff' : '#000000'
                      }
                    >
                      You've earned:
                    </EarnedTypography>
                  </Box>
                  <RewardsAmountBox
                    isSuccess={isMerklSuccess}
                    rewardAmount={amount}
                    isConfirmed={isConfirmed}
                  />
                </FlexCenterRowBox>
                <ClaimButtonBox>
                  <Button
                    disabled={
                      isPending ||
                      isConfirming ||
                      isConfirmed ||
                      (!!amount && amount === 0) ||
                      (isMerklSuccess && !amount)
                    }
                    variant="primary"
                    aria-label="Claim rewards"
                    size="large"
                    styles={{
                      opacity:
                        isPending ||
                        isConfirming ||
                        isConfirmed ||
                        (!!amount && amount === 0) ||
                        (isMerklSuccess && !amount)
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
                        rewardAmountBN:
                          availableReward.accumulatedAmountForContractBN,
                        rewardToken: availableReward.address,
                        claimingAddress:
                          availableReward.claimingAddress as `0x${string}`,
                      })
                    }
                  >
                    <Typography
                      fontSize="16px"
                      lineHeight="18px"
                      fontWeight={600}
                      color={theme.palette.white.main}
                    >
                      {isPending || isConfirming
                        ? 'CLAIMING...'
                        : isConfirmed
                          ? 'CLAIMED'
                          : 'CLAIM REWARDS'}
                    </Typography>
                  </Button>
                </ClaimButtonBox>
                {hash ? (
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
                        sx={{ height: '32px', color: theme.palette.white.main }}
                      />
                    </RewardsOpenIconButton>
                  </a>
                ) : undefined}
              </RewardsCarouselMainBox>
            );
          })}
        </RewardsCarouselContainer>
      ) : undefined}
    </>
  );
};
