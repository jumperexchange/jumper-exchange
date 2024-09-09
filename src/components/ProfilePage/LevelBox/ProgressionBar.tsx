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
            <Button
              aria-label="Page Navigation"
              variant="secondary"
              size="medium"
              styles={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                pointerEvents: 'none',
                paddingLeft: '12px',
                height: '32px',
              }}
            >
              <NoSelectTypography
                fontSize="12px"
                lineHeight="16px"
                fontWeight={600}
                marginRight="8px"
              >
                LEVEL {levelData.level} • {levelData.minPoints}
              </NoSelectTypography>
              <XPIcon size={16} />
            </Button>
            <Button
              aria-label="Page Navigation"
              variant="secondary"
              size="medium"
              styles={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                pointerEvents: 'none',
                paddingLeft: '12px',
                height: '32px',
              }}
            >
              <NoSelectTypography
                fontSize="12px"
                lineHeight="16px"
                fontWeight={600}
                marginRight="8px"
              >
                LEVEL {levelData.level + 1} • {levelData.maxPoints}
              </NoSelectTypography>
              <XPIcon size={16} />
            </Button>
          </Box>
        </>
      ) : null}
    </Box>
  );
};
