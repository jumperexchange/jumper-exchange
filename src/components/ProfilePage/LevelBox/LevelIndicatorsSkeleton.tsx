import Skeleton from '@mui/material/Skeleton';
import { LevelIndicatorWrapper } from './ProgressionBar.style';

export const LevelIndicatorsSkeleton = () => {
  return (
    <LevelIndicatorWrapper>
      <Skeleton
        width={135}
        height={32}
        sx={{ transform: 'unset', borderRadius: '16px' }}
      />
      <Skeleton
        width={135}
        height={32}
        sx={{ transform: 'unset', borderRadius: '16px' }}
      />
    </LevelIndicatorWrapper>
  );
};
