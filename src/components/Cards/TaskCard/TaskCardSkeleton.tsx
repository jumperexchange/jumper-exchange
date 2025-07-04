import {
  TaskContainer,
  TaskHeaderContainer,
  BaseSkeleton,
} from './TaskCard.styles';
import Box from '@mui/material/Box';

export const TaskCardSkeleton = () => {
  return (
    <TaskContainer>
      <TaskHeaderContainer>
        <BaseSkeleton
          animation="wave"
          variant="rounded"
          sx={{
            width: 80,
            height: 24,
          }}
        />
      </TaskHeaderContainer>
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
    </TaskContainer>
  );
};
