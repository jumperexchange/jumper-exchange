import type { LevelData } from '@/types/loyaltyPass';
import { Box } from '@mui/material';
import {
  ProgressionChart,
  ProgressionChartBg,
  ProgressionChartScore,
} from './ProgressionBar.style';
import { LevelIndicator } from './LevelIndicator';

interface ProgressionBarProps {
  points?: number;
  levelData?: LevelData;
}

export const ProgressionBar = ({ points, levelData }: ProgressionBarProps) => {
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
        </>
      ) : null}
    </Box>
  );
};
