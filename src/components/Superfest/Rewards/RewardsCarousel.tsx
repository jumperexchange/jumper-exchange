import { Box, Stack, Typography } from '@mui/material';
import {
  RewardsCarouselContainer,
  RewardsCarouselHeader,
  RewardsCarouselTitle,
} from './RewardsCarousel.style';
import { RewardsBox } from './RewardsBox/RewardsBox';
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
import { MerklDistributorABI } from 'src/const/abi/merklDistributorABI';

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
  const { chains, switchChainAsync } = useSwitchChain();
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
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              alignContent: 'center',
              padding: '32px',
            }}
          >
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
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box sx={{ marginLeft: '32px' }}>
                <Image
                  src={'https://strapi.li.finance/uploads/op_dddbaa6b32.png'}
                  alt="token image"
                  width={40}
                  height={40}
                  style={{
                    borderRadius: 16,
                  }}
                />
                <Image
                  src={'https://strapi.li.finance/uploads/op_dddbaa6b32.png'}
                  alt="token image"
                  width={15}
                  height={15}
                  style={{
                    borderRadius: 16,
                    border: '2px solid',
                    borderColor: '#FFFFFF',
                    zIndex: 10,
                    marginTop: 16,
                    marginLeft: -8,
                  }}
                />
              </Box>
              <Box sx={{ marginLeft: '8px' }}>
                <Typography
                  sx={{
                    fontSize: '40px',
                    fontWeight: 700,
                    typography: sora.style.fontFamily,
                  }}
                >
                  {rewardAmount ?? '...'}
                </Typography>
              </Box>
            </Box>
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
            {/* <RewardsBox /> */}
          </Box>
        </RewardsCarouselContainer>
      )}
    </>
  );
};
