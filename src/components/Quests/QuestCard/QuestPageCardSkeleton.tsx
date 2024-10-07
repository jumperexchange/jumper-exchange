import { Skeleton } from '@mui/material';
import { QuestPageCardSkeletonContainer } from './QuestPageCardSkeleton.style';

export const QuestPageCardSkeleton = () => {
  return (
    <QuestPageCardSkeletonContainer>
      <Skeleton
        variant="rectangular"
        sx={{
          height: '450px',
          width: '288px',
          textAlign: 'center',
          borderRadius: '8px',
          transform: 'unset',
          aspectRatio: 550 / 300,
        }}
      />
    </QuestPageCardSkeletonContainer>
  );
};
