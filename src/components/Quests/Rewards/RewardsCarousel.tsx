import { ChainId } from '@lifi/types';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Box, Typography } from '@mui/material';
import { Button } from 'src/components/Button';
import { PROFILE_CAMPAIGN_SCANNER } from 'src/const/partnerRewardsTheme';
import {
  useAccount,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { MerklDistribABI } from '../../../const/abi/merklABI';
import { FlexCenterRowBox } from '../QuestPage/QuestsMissionPage.style';
import { RewardsAmountBox } from './RewardsAmountBox/RewardsAmountBox';
import {
  ClaimButtonBox,
  EarnedTypography,
  RewardsCarouselContainer,
  RewardsCarouselMainBox,
  RewardsOpenIconButton,
} from './RewardsCarousel.style';

interface RewardsCarouselProps {
  hideComponent: boolean;
  rewardAmount: number;
  accumulatedAmountForContractBN: string;
  isMerklSuccess: boolean;
  proof: string[];
}

const CLAIMING_CONTRACT_ADDRESS = '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae';
const OP_TOKEN = '0x4200000000000000000000000000000000000042';
//TESTING
// const TEST_TOKEN = '0x41A65AAE5d1C8437288d5a29B4D049897572758E';

export const RewardsCarousel = ({
  hideComponent,
  rewardAmount,
  accumulatedAmountForContractBN,
  isMerklSuccess,
  proof,
}: RewardsCarouselProps) => {
  const { address } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  async function handleClick() {
    try {
      const { id } = await switchChainAsync({
        chainId: ChainId.OPT,
      });

      const canClaim =
        id === ChainId.OPT &&
        address &&
        isMerklSuccess &&
        proof &&
        rewardAmount > 0;

      if (canClaim) {
        writeContract({
          address: CLAIMING_CONTRACT_ADDRESS,
          abi: MerklDistribABI,
          functionName: 'claim',
          // args: [[address], [OP_TOKEN], [rewardAmountBN], [proof]], //   function claim(address[] calldata users, address[] calldata tokens, uint256[] calldata amounts, bytes32[][] calldata proofs)
          // TESTING
          args: [
            [address],
            [OP_TOKEN],
            [accumulatedAmountForContractBN],
            [proof],
          ], //   function claim(address[] calldata users, address[] calldata tokens, uint256[] calldata amounts, bytes32[][] calldata proofs)
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
    <>
      {!hideComponent && rewardAmount && rewardAmount > 0 ? (
        <RewardsCarouselContainer>
          <RewardsCarouselMainBox>
            <FlexCenterRowBox>
              <Box>
                <EarnedTypography>You've earned:</EarnedTypography>
              </Box>
              <RewardsAmountBox
                rewardAmount={rewardAmount}
                isConfirmed={isConfirmed}
              />
            </FlexCenterRowBox>
            <ClaimButtonBox>
              <Button
                disabled={
                  isPending ||
                  isConfirming ||
                  isConfirmed ||
                  (!!rewardAmount && rewardAmount === 0)
                }
                variant="primary"
                aria-label="Claim rewards"
                size="large"
                styles={{
                  alignItems: 'center',
                  padding: '16px',
                  width: '100%',
                }}
                onClick={() => handleClick()}
              >
                <Typography fontSize="16px" lineHeight="18px" fontWeight={600}>
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
                href={`${PROFILE_CAMPAIGN_SCANNER}/tx/${hash}`}
                target="_blank"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  marginLeft: '32px',
                }}
                rel="noreferrer"
              >
                <RewardsOpenIconButton>
                  <OpenInNewIcon sx={{ height: '32px' }} />
                </RewardsOpenIconButton>
              </a>
            ) : undefined}
          </RewardsCarouselMainBox>
        </RewardsCarouselContainer>
      ) : undefined}
    </>
  );
};
