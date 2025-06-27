import {
  MissionTaskContainer,
  MissionTaskHeaderContainer,
  BaseSkeleton,
} from './MissionTaskCard.style';
import Box from '@mui/material/Box';

export const MissionTaskCardSkeleton = () => {
  return (
    <MissionTaskContainer>
      <MissionTaskHeaderContainer>
        <BaseSkeleton
          animation="wave"
          variant="rounded"
          sx={{
            width: 80,
            height: 24,
          }}
        />
      </MissionTaskHeaderContainer>
      <BaseSkeleton
        variant="text"
        animation="wave"
        sx={{
          height: 24,
          width: '40%',
        }}
      />
      <Box>
        <BaseSkeleton
          variant="text"
          animation="wave"
          sx={{
            height: 20,
            width: '100%',
          }}
        />
      </Box>
    </MissionTaskContainer>
  );
};
