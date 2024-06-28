import { Skeleton } from '@mui/material';
import { QuestCardSkeletonContainer } from './QuestCardSkeleton.style';

export const QuestCardSkeleton = () => {
  return (
    <QuestCardSkeletonContainer>
      <Skeleton
        variant="rectangular"
        sx={{
          height: '416px',
          width: '256px',
          borderRadius: '4px',
          transform: 'unset',
          aspectRatio: 550 / 300,
        }}
      />
    </QuestCardSkeletonContainer>
  );
};
