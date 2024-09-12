import type { LevelData } from '@/types/loyaltyPass';
import { Box } from '@mui/material';
import { XPIcon } from '../../illustrations/XPIcon';
import { CenteredBox, NoSelectTypography } from '../ProfilePage.style';
import {
  ProgressionChart,
  ProgressionChartBg,
  ProgressionChartScore,
} from './ProgressionBar.style';
import { Button } from '../../../components/Button';
import { LevelButton } from './LevelButton';

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
            <LevelButton level={levelData.level} points={levelData.minPoints} />
            <LevelButton
              level={levelData.level + 1}
              points={levelData.maxPoints}
            />
          </Box>
        </>
      ) : null}
    </Box>
  );
};
