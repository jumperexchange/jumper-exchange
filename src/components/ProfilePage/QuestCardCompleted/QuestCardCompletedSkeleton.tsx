import { Skeleton } from '@mui/material';
import { QuestCardCompletedSkeletonContainer } from './QuestCardCompletedSkeleton.style';

export const QuestCardCompletedSkeleton = () => {
  return (
    <QuestCardCompletedSkeletonContainer>
      <Skeleton
        variant="rectangular"
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: '4px',
          transform: 'unset',
          aspectRatio: 550 / 300,
        }}
      />
    </QuestCardCompletedSkeletonContainer>
  );
};
