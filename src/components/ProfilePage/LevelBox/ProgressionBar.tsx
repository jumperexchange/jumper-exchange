import type { LevelData } from '@/types/loyaltyPass';
import { Box } from '@mui/material';
import { LevelIndicator } from './LevelIndicator';
import {
  ProgressionChart,
  ProgressionChartBg,
  ProgressionChartScore,
  ProgressionContainer,
} from './ProgressionBar.style';

interface ProgressionBarProps {
  ongoingValue?: number;
  levelData?: LevelData;
  hideLevelIndicator?: boolean;
}

export const ProgressionBar = ({
  ongoingValue,
  levelData,
  hideLevelIndicator,
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
      {levelData ? (
        <>
          <ProgressionChart>
            <ProgressionChartScore
              ongoingValue={ongoingValue}
              calcWidth={calcWidth}
              levelData={levelData}
            />
            <ProgressionChartBg />
          </ProgressionChart>
          {!hideLevelIndicator && levelData.level && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '24px',
              }}
            >
              <LevelIndicator
                level={levelData.level}
                bound={levelData.minPoints}
              />
              <LevelIndicator
                level={levelData.level + 1}
                bound={levelData.maxPoints}
              />
            </Box>
          )}
        </>
      ) : null}
    </ProgressionContainer>
  );
};
