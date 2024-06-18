import { Box, Stack } from '@mui/material';
import {
  RewardsCarouselContainer,
  RewardsCarouselHeader,
  RewardsCarouselTitle,
} from './RewardsCarousel.style';
import { RewardsBox } from './RewardsBox/RewardsBox';

export const RewardsCarousel = ({}) => {
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
