import type { LevelData } from '@/types/loyaltyPass';
import { Box } from '@mui/material';
import { LevelIndicator } from './LevelIndicator';
import {
  ProgressionChart,
  ProgressionChartBg,
  ProgressionChartScore,
} from './ProgressionBar.style';

interface ProgressionBarProps {
  points?: number;
  levelData?: LevelData;
  hideIndicator?: boolean;
}

export const ProgressionBar = ({
  points,
  levelData,
  hideIndicator,
}: ProgressionBarProps) => {
  const calcWidth =
    points && levelData
      ? points - levelData.minPoints > 0
        ? ((points - levelData.minPoints) /
            (levelData.maxPoints - levelData.minPoints)) *
          100
        : 0
      : 0;

  return (
    <Box>
      {levelData ? (
        <>
          <ProgressionChart>
            <ProgressionChartScore
              points={points}
              calcWidth={calcWidth}
              levelData={levelData}
            />
            <ProgressionChartBg />
          </ProgressionChart>
          {!hideIndicator && levelData.level && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '24px',
              }}
            >
              <LevelIndicator
                level={levelData.level}
                points={levelData.minPoints}
              />
              <LevelIndicator
                level={levelData.level + 1}
                points={levelData.maxPoints}
              />
            </Box>
          )}
        </>
      ) : null}
    </Box>
  );
};
