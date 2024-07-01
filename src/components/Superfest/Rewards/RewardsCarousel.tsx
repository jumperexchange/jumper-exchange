import { Box, Typography } from '@mui/material';
import {
  RewardsCarouselContainer,
  RewardsCarouselMainBox,
  ClaimButtonBox,
  EarnedTypography,
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
import { Sequel85Typography, SoraTypography } from '../Superfest.style';
import { FlexCenterRowBox } from '../SuperfestPage/SuperfestMissionPage.style';

interface RewardsCarouselProps {
  showComponent: boolean;
  rewardAmount: number;
  rewardAmountBN: string;
  isMerklSuccess: boolean;
  proof: any;
}

const CLAIMING_CONTRACT_ADDRESS = '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae';
const OP_TOKEN = '0x4200000000000000000000000000000000000042';

export const RewardsCarousel = ({
  showComponent,
  rewardAmount,
  rewardAmountBN,
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
      if (
        id === ChainId.OPT &&
        address &&
        isMerklSuccess &&
        proof &&
        rewardAmount > 0
      ) {
        writeContract({
          address: CLAIMING_CONTRACT_ADDRESS,
          abi: MerklDistribABI,
          functionName: 'claim',
          args: [[address], [OP_TOKEN], [rewardAmountBN], [proof]], //   function claim(address[] calldata users, address[] calldata tokens, uint256[] calldata amounts, bytes32[][] calldata proofs)
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      {showComponent ? undefined : (
        <RewardsCarouselContainer>
          <RewardsCarouselMainBox>
            <FlexCenterRowBox>
              <Box>
                <EarnedTypography>You've earned:</EarnedTypography>
              </Box>
              <RewardsAmountBox rewardAmount={rewardAmount} />
            </FlexCenterRowBox>
            <ClaimButtonBox>
              <Button
                disabled={isPending || isConfirming || isConfirmed}
                variant="secondary"
                size="large"
                styles={{
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                  border: '2px dotted',
                  padding: '16px',
                  width: '100%',
                  '&:hover': {
                    color: '#FFFFFF',
                    backgroundColor: '#ff0420',
                  },
                }}
                onClick={() => handleClick()}
              >
                <SoraTypography
                  fontSize="16px"
                  lineHeight="18px"
                  fontWeight={600}
                >
                  {isConfirmed ? 'Claimed' : 'Claim Rewards'}
                </SoraTypography>
              </Button>
            </ClaimButtonBox>
          </RewardsCarouselMainBox>
        </RewardsCarouselContainer>
      )}
    </>
  );
};
