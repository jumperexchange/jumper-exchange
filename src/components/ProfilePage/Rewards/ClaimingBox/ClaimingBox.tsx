import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useTheme } from '@mui/material';
import { MerklDistribABI } from 'src/const/abi/merklABI';
import type { AvailableRewards } from 'src/hooks/useMerklRewards';
import {
  useAccount,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import {
  ClaimingBoxContainer,
  RewardsOpenIconButton,
} from '../RewardsCarousel.style';
import { ClaimingAmount } from './ClaimingAmount';
import { ClaimingButton } from './ClaimingBox.style';

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

  const isButtonDisabled =
    isPending || isConfirming || (!!amount && amount === 0) || !amount;

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
      console.error(err);
    }
  }

  return (
    <ClaimingBoxContainer marginTop={'8px'} gap={3}>
      <ClaimingAmount
        rewardAmount={amount}
        isConfirmed={isConfirmed}
        tokenLogo={availableReward.tokenLogo}
        chainLogo={availableReward.chainLogo}
      />
      {isConfirmed ? null : (
        // <ClaimButtonBox>
        <ClaimingButton
          isDisabled={isButtonDisabled}
          disabled={isButtonDisabled}
          aria-label="Claim"
          size="large"
          onClick={() =>
            handleClick({
              tokenChainid: availableReward.chainId,
              proof: availableReward.proof,
              rewardAmount: availableReward.amountToClaim,
              rewardAmountBN: availableReward.accumulatedAmountForContractBN,
              rewardToken: availableReward.address,
              claimingAddress: availableReward.claimingAddress as `0x${string}`,
            })
          }
        >
          {isPending || isConfirming ? 'Claiming...' : 'Claim'}
        </ClaimingButton>
        // </ClaimButtonBox>
      )}
      {hash && isConfirmed ? (
        <a
          href={`${availableReward.explorerLink}/tx/${hash}`}
          target="_blank"
          style={{
            textDecoration: 'none',
            color: 'inherit',
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
    </ClaimingBoxContainer>
  );
};
