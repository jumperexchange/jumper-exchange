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
  chartBg?: string;
  chartCol?: string;
  label?: string;
}

export const ProgressionBar = ({
  ongoingValue,
  levelData,
  hideLevelIndicator,
  label,
  loading,
  chartBg,
  chartCol,
}: ProgressionBarProps) => {
  const calcWidth =
    levelData && ongoingValue
      ? Math.max(
          ((ongoingValue - levelData.minPoints) /
            (levelData.maxPoints - levelData.minPoints)) *
            100,
          0,
        )
      : 0;

  if (loading || !levelData) {
    return (
      <ProgressionContainer hideLevelIndicator={hideLevelIndicator}>
        <Box>
          <Skeleton width="100%" height={16} sx={{ transform: 'unset' }} />
          {!hideLevelIndicator && <LevelIndicatorsSkeleton />}
        </Box>
      </ProgressionContainer>
    );
  }

  return (
    <ProgressionContainer hideLevelIndicator={hideLevelIndicator}>
      <ProgressionChart label={label}>
        <ProgressionChartScore
          ongoingValue={ongoingValue}
          calcWidth={calcWidth}
          levelData={levelData}
          chartCol={chartCol}
        />
        <ProgressionChartBg />
      </ProgressionChart>

      {!hideLevelIndicator && (
        <LevelIndicatorWrapper>
          <LevelIndicator
            level={levelData.level ?? 0}
            bound={levelData.minPoints}
          />
          <LevelIndicator
            level={(levelData.level ?? 0) + 1}
            bound={levelData.maxPoints}
          />
        </LevelIndicatorWrapper>
      )}
    </ProgressionContainer>
  );
};
