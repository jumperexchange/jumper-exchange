import { Box, Stack, Typography } from '@mui/material';
import {
  RewardsCarouselContainer,
  RewardsCarouselHeader,
  RewardsCarouselMainBox,
  RewardsCarouselTitle,
} from './RewardsCarousel.style';
import { RewardsAmountBox } from './RewardsAmountBox/RewardsAmountBox';
import Image from 'next/image';
import { Button } from 'src/components/Button';
import { ProfilePageTypography } from 'src/components/ProfilePage/ProfilePage.style';
import { sequel85, sora } from 'src/fonts/fonts';
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useSwitchChain,
} from 'wagmi';
import { ChainId } from '@lifi/types';
import { MerklDistributorABI } from './../../../const/abi/merklDistributorABI';

interface RewardsCarouselProps {
  isLoading: boolean;
  rewardAmount: number;
  rewardAmountBN: string;
  isMerklSuccess: boolean;
  proof: any;
}

const CLAIMING_CONTRACT_ADDRESS = '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae';
const OP_TOKEN = '0x4200000000000000000000000000000000000042';

export const RewardsCarousel = ({
  isLoading,
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
          abi: MerklDistributorABI,
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
      {isLoading ? undefined : (
        <RewardsCarouselContainer>
          <RewardsCarouselMainBox>
            <Typography
              sx={{
                fontSize: '32px',
                lineHeight: '32px',
                fontWeight: 700,
                typography: sequel85.style.fontFamily,
              }}
            >
              You've earned:
            </Typography>
            <RewardsAmountBox rewardAmount={rewardAmount} />
            <Button
              disabled={isPending || isConfirming || isConfirmed}
              variant="secondary"
              size="large"
              styles={{
                width: '15%',
                marginLeft: '32px',
                alignItems: 'center',
                backgroundColor: 'transparent',
                borderColor: '#ffffff',
                border: '2px dotted',
                padding: '16px',
                '&:hover': {
                  color: '#FFFFFF',
                  backgroundColor: '#ff0420',
                },
              }}
              onClick={() => handleClick()}
            >
              <ProfilePageTypography
                fontSize="16px"
                lineHeight="18px"
                fontWeight={600}
              >
                {isConfirmed ? 'Claimed' : 'Claim Rewards'}
              </ProfilePageTypography>
            </Button>
          </RewardsCarouselMainBox>
        </RewardsCarouselContainer>
      )}
    </>
  );
};
