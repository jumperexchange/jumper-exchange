import { Skeleton } from '@mui/material';
import { QuestCardSkeletonContainer } from './QuestCardSkeleton.style';

export const QuestCardSkeleton = () => {
  return (
    <QuestCardSkeletonContainer>
      <Skeleton
        variant="rectangular"
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: '1px',
          transform: 'unset',
          aspectRatio: 550 / 300,
        }}
      />
    </QuestCardSkeletonContainer>
  );
};
