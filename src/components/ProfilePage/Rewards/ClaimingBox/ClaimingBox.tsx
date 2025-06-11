import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useTheme } from '@mui/material';
import { MerklDistribABI } from 'src/const/abi/merklABI';
import { AvailableRewardsExtended } from 'src/types/merkl';
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
import { ClaimingButton } from './ClaimingBox.style';
import { ClaimingDetails } from './ClaimingDetails';

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
  availableReward: AvailableRewardsExtended;
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
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <ClaimingBoxContainer gap={3}>
      <ClaimingDetails
        rewardAmount={amount}
        isConfirmed={isConfirmed}
        tokenLogo={availableReward.tokenLogo}
        chainLogo={availableReward.chainLogo}
      />
      {isConfirmed ? null : (
        <ClaimingButton
          isDisabled={isButtonDisabled}
          disabled={isButtonDisabled}
          loading={isPending || isConfirming}
          loadingPosition="start"
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
          {isPending || isConfirming ? 'Claiming' : 'Claim'}
        </ClaimingButton>
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
