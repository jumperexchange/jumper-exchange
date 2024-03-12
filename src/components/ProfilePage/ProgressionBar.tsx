import { Box, useTheme } from '@mui/material';
import { CenteredBox, ProfilePageTypography } from './ProfilePage.style';
import { XPBox } from './xpBox';
import { LevelData } from 'src/types';

interface ProgressionBarProps {
  points?: number | null;
  levelData?: LevelData;
}

export const ProgressionBar = ({ points, levelData }: ProgressionBarProps) => {
  const theme = useTheme();
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <ProfilePageTypography fontSize={'14px'} lineHeight={'18px'}>
              {`LEVEL ${levelData?.level}`}
            </ProfilePageTypography>
            <ProfilePageTypography fontSize={'14px'} lineHeight={'18px'}>
              {`LEVEL ${levelData.level + 1}`}
            </ProfilePageTypography>
          </Box>
          <Box
            sx={{
              height: '16px',
              width: '100%',
              display: 'flex',
              marginTop: '12px',
              marginBottom: '12px',
            }}
          >
            <Box
              sx={{
                height: '100%',
                width:
                  points && points > levelData.minPoints
                    ? `${calcWidth}%`
                    : '0%',
                backgroundColor:
                  theme.palette.mode === 'light' ? '#31007A' : '#BEA0EB',
                borderTopLeftRadius: '12px',
                borderBottomLeftRadius: '12px',
                borderRadius: points === levelData.maxPoints ? '12px' : null,
              }}
            />
            <Box
              sx={{
                height: '100%',
                width:
                  points && points > levelData.minPoints
                    ? '100%'
                    : `${100 - calcWidth}%`,
                backgroundColor: '#f5f5f5',
                borderTopRightRadius: '12px',
                borderBottomRightRadius: '12px',
                borderRadius: points ? null : '12px',
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <CenteredBox>
              <ProfilePageTypography
                fontSize={'16px'}
                lineHeight={'20px'}
                fontWeight={600}
              >
                {levelData.minPoints}
              </ProfilePageTypography>
              <XPBox size={24} marginLeft={'8px'} />
            </CenteredBox>
            <CenteredBox>
              <ProfilePageTypography
                fontSize={'16px'}
                lineHeight={'20px'}
                fontWeight={600}
              >
                {levelData.maxPoints}
              </ProfilePageTypography>
              <XPBox size={24} marginLeft={'8px'} />
            </CenteredBox>
          </Box>
        </>
      ) : null}
    </Box>
  );
};
