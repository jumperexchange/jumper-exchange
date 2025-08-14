import type { SxProps, Theme } from '@mui/material';
import { Skeleton } from '@mui/material';
import { QuestCardSkeletonContainer } from './QuestCardSkeleton.style';

interface QuestCardSkeletonProps {
  sx?: SxProps<Theme> | undefined;
}

export const QuestCardSkeleton = ({ sx }: QuestCardSkeletonProps) => {
  return (
    <QuestCardSkeletonContainer sx={sx}>
      <Skeleton
        variant="rectangular"
        sx={{
          width: '100%',
          height: '100%',
          transform: 'unset',
          aspectRatio: 550 / 300,
          borderRadius: 'inherit',
        }}
      />
    </QuestCardSkeletonContainer>
  );
};
