import type { LevelData } from '@/types/loyaltyPass';
import { Box } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { LevelIndicator } from './LevelIndicator';
import { LevelIndicatorsSkeleton } from './LevelIndicatorsSkeleton';
import {
  LevelIndicatorWrapper,
  ProgressionChart,
  ProgressionChartBg,
  ProgressionChartScore,
  ProgressionContainer,
} from './ProgressionBar.style';

interface ProgressionBarProps {
  ongoingValue?: number;
  levelData?: LevelData;
  hideLevelIndicator?: boolean;
  loading?: boolean;
}

export const ProgressionBar = ({
  ongoingValue,
  levelData,
  hideLevelIndicator,
  loading,
}: ProgressionBarProps) => {
  const calcWidth =
    ongoingValue && levelData
      ? ongoingValue - levelData.minPoints > 0
        ? ((ongoingValue - levelData.minPoints) /
            (levelData.maxPoints - levelData.minPoints)) *
          100
        : 0
      : 0;

  return (
    <ProgressionContainer hideLevelIndicator={hideLevelIndicator}>
      {!loading && !!levelData ? (
        !!levelData && (
          <>
            <ProgressionChart>
              <ProgressionChartScore
                ongoingValue={ongoingValue}
                calcWidth={calcWidth}
                levelData={levelData}
              />
              <ProgressionChartBg />
            </ProgressionChart>
            {hideLevelIndicator ? null : !!levelData.level ? (
              <LevelIndicatorWrapper>
                <LevelIndicator
                  level={levelData.level}
                  bound={levelData.minPoints}
                />
                <LevelIndicator
                  level={levelData.level + 1}
                  bound={levelData.maxPoints}
                />
              </LevelIndicatorWrapper>
            ) : (
              <LevelIndicatorsSkeleton />
            )}
          </>
        )
      ) : (
        <Box>
          <Skeleton width={'100%'} height={16} sx={{ transform: 'unset' }} />
          {!hideLevelIndicator && <LevelIndicatorsSkeleton />}
        </Box>
      )}
    </ProgressionContainer>
  );
};
