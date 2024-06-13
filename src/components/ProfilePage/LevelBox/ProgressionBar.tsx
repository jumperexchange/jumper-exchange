import type { LevelData } from '@/types/loyaltyPass';
import { Box } from '@mui/material';
import { XPIcon } from '../../illustrations/XPIcon';
import { CenteredBox, ProfilePageTypography } from '../ProfilePage.style';
import {
  ProgressionChart,
  ProgressionChartBg,
  ProgressionChartScore,
} from './ProgressionBar.style';

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
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              justifyContent: 'space-between',
            }}
          >
            <ProfilePageTypography fontSize="14px" lineHeight="18px">
              {`LEVEL ${levelData?.level}`}
            </ProfilePageTypography>
            <ProfilePageTypography fontSize="14px" lineHeight="18px">
              {`LEVEL ${levelData.level + 1}`}
            </ProfilePageTypography>
          </Box>
          <ProgressionChart>
            <ProgressionChartScore
              points={points}
              calcWidth={calcWidth}
              levelData={levelData}
            />
            <ProgressionChartBg />
          </ProgressionChart>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <CenteredBox>
              <ProfilePageTypography
                fontSize="16px"
                lineHeight="20px"
                fontWeight={600}
              >
                {levelData.minPoints}
              </ProfilePageTypography>
              <CenteredBox sx={{ marginLeft: '8px' }}>
                <XPIcon size={24} />
              </CenteredBox>
            </CenteredBox>
            <CenteredBox>
              <ProfilePageTypography
                fontSize={'16px'}
                lineHeight={'20px'}
                fontWeight={600}
              >
                {levelData.maxPoints}
              </ProfilePageTypography>
              <CenteredBox sx={{ marginLeft: '8px' }}>
                <XPIcon size={24} />
              </CenteredBox>
            </CenteredBox>
          </Box>
        </>
      ) : null}
    </Box>
  );
};
