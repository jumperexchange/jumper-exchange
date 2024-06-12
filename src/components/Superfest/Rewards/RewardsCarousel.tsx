import { Box, Stack } from '@mui/material';
import {
  RewardsCarouselContainer,
  RewardsCarouselHeader,
  RewardsCarouselTitle,
} from './RewardsCarousel.style';
import { RewardsBox } from './RewardsBox/RewardsBox';
import { ClaimingButton } from './ClaimingButton/ClaimingButton';
import { useMerklRewards } from 'src/hooks/useMerklRewards';

export const RewardsCarousel = ({}) => {
  const {} = useMerklRewards({
    userAddress: '0x55048e0d46f66fa00cae12905f125194cd961581',
  });

  return (
    <RewardsCarouselContainer>
      <RewardsCarouselHeader>
        <RewardsCarouselTitle>{'Your Rewards'}</RewardsCarouselTitle>
      </RewardsCarouselHeader>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
          padding: '32px',
        }}
      >
        <RewardsBox />
      </Box>
    </RewardsCarouselContainer>
  );
};
