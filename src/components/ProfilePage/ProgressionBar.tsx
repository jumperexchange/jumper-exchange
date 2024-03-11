import { Box, Stack, Typography, alpha, useTheme } from '@mui/material';
import { ProfilePageTypography } from './ProfilePage.style';

const progressionData = [
  {
    title: 'Novice',
    minPoints: 0,
    maxPoints: 51,
  },
  {
    title: 'Bronze',
    minPoints: 51,
    maxPoints: 151,
  },
  {
    title: 'Silver',
    minPoints: 151,
    maxPoints: 351,
  },
  {
    title: 'Gold',
    minPoints: 351,
    maxPoints: 701,
  },
  {
    title: 'Platinum',
    minPoints: 701,
    maxPoints: 1100,
  },
  {
    title: 'Tungsten',
    minPoints: 1100,
    maxPoints: 2000,
  },
];

const levelsData = [
  { level: 1, minPoints: 0, maxPoints: 10 },
  { level: 2, minPoints: 10, maxPoints: 20 },
  { level: 3, minPoints: 20, maxPoints: 50 },
  { level: 4, minPoints: 50, maxPoints: 75 },
  { level: 5, minPoints: 75, maxPoints: 100 },
  { level: 6, minPoints: 100, maxPoints: 150 },
  { level: 7, minPoints: 150, maxPoints: 225 },
  { level: 8, minPoints: 225, maxPoints: 350 },
  { level: 9, minPoints: 350, maxPoints: 500 },
  { level: 10, minPoints: 500, maxPoints: 700 },
  { level: 11, minPoints: 700, maxPoints: 900 },
  { level: 12, minPoints: 900, maxPoints: 1100 },
  { level: 13, minPoints: 1100, maxPoints: 1300 },
  { level: 14, minPoints: 1300, maxPoints: 1500 },
  { level: 15, minPoints: 1500, maxPoints: 1700 },
  { level: 16, minPoints: 1700, maxPoints: 1900 },
  { level: 17, minPoints: 1900, maxPoints: 2100 },
  { level: 18, minPoints: 2100, maxPoints: 2300 },
  { level: 19, minPoints: 2300, maxPoints: 2500 },
  { level: 20, minPoints: 2500, maxPoints: 2700 },
  { level: 21, minPoints: 2700, maxPoints: 2900 },
  { level: 22, minPoints: 2900, maxPoints: 3100 },
  { level: 23, minPoints: 3100, maxPoints: 3300 },
  { level: 24, minPoints: 3300, maxPoints: 3500 },
  { level: 25, minPoints: 3500, maxPoints: 3700 },
  { level: 26, minPoints: 3700, maxPoints: 3900 },
  { level: 27, minPoints: 3900, maxPoints: 4100 },
  { level: 28, minPoints: 4100, maxPoints: 4300 },
  { level: 29, minPoints: 4300, maxPoints: 4500 },
  { level: 30, minPoints: 4500, maxPoints: 4700 },
  { level: 31, minPoints: 4700, maxPoints: 4900 },
  { level: 32, minPoints: 4900, maxPoints: 5100 },
  { level: 33, minPoints: 5100, maxPoints: 5300 },
  { level: 34, minPoints: 5300, maxPoints: 5500 },
  { level: 35, minPoints: 5500, maxPoints: 5700 },
  { level: 36, minPoints: 5700, maxPoints: 5900 },
  { level: 37, minPoints: 5900, maxPoints: 6100 },
  { level: 38, minPoints: 6100, maxPoints: 6300 },
  { level: 39, minPoints: 6300, maxPoints: 6500 },
  { level: 40, minPoints: 6500, maxPoints: 6700 },
  { level: 41, minPoints: 6700, maxPoints: 6900 },
  { level: 42, minPoints: 6900, maxPoints: 7100 },
  { level: 43, minPoints: 7100, maxPoints: 7300 },
  { level: 44, minPoints: 7300, maxPoints: 7500 },
  { level: 45, minPoints: 7500, maxPoints: 7700 },
  { level: 46, minPoints: 7700, maxPoints: 7900 },
  { level: 47, minPoints: 7900, maxPoints: 8100 },
  { level: 48, minPoints: 8100, maxPoints: 8300 },
  { level: 49, minPoints: 8300, maxPoints: 8500 },
  { level: 50, minPoints: 8500, maxPoints: 8700 },
  { level: 51, minPoints: 8700, maxPoints: 8900 },
  { level: 52, minPoints: 8900, maxPoints: 9100 },
  { level: 53, minPoints: 9100, maxPoints: 9300 },
  { level: 54, minPoints: 9300, maxPoints: 9500 },
  { level: 55, minPoints: 9500, maxPoints: 9700 },
  { level: 56, minPoints: 9700, maxPoints: 9900 },
  { level: 57, minPoints: 9900, maxPoints: 10100 },
  { level: 58, minPoints: 10100, maxPoints: 10300 },
  { level: 59, minPoints: 10300, maxPoints: 10500 },
  { level: 60, minPoints: 10500, maxPoints: 10700 },
  { level: 61, minPoints: 10700, maxPoints: 10900 },
  { level: 62, minPoints: 10900, maxPoints: 11100 },
  { level: 63, minPoints: 11100, maxPoints: 11300 },
  { level: 64, minPoints: 11300, maxPoints: 11500 },
  { level: 65, minPoints: 11500, maxPoints: 11700 },
  { level: 66, minPoints: 11700, maxPoints: 11900 },
  { level: 67, minPoints: 11900, maxPoints: 12100 },
  { level: 68, minPoints: 12100, maxPoints: 12300 },
  { level: 69, minPoints: 12300, maxPoints: 12500 },
  { level: 70, minPoints: 12500, maxPoints: 12700 },
  { level: 71, minPoints: 12700, maxPoints: 12900 },
  { level: 72, minPoints: 12900, maxPoints: 13100 },
  { level: 73, minPoints: 13100, maxPoints: 13300 },
  { level: 74, minPoints: 13300, maxPoints: 13500 },
  { level: 75, minPoints: 13500, maxPoints: 13700 },
  { level: 76, minPoints: 13700, maxPoints: 13900 },
  { level: 77, minPoints: 13900, maxPoints: 14100 },
  { level: 78, minPoints: 14100, maxPoints: 14300 },
  { level: 79, minPoints: 14300, maxPoints: 14500 },
  { level: 80, minPoints: 14500, maxPoints: 14700 },
  { level: 81, minPoints: 14700, maxPoints: 14900 },
  { level: 82, minPoints: 14900, maxPoints: 15100 },
  { level: 83, minPoints: 15100, maxPoints: 15300 },
  { level: 84, minPoints: 15300, maxPoints: 15500 },
  { level: 85, minPoints: 15500, maxPoints: 15700 },
  { level: 86, minPoints: 15700, maxPoints: 15900 },
  { level: 87, minPoints: 15900, maxPoints: 16100 },
  { level: 88, minPoints: 16100, maxPoints: 16300 },
  { level: 89, minPoints: 16300, maxPoints: 16500 },
  { level: 90, minPoints: 16500, maxPoints: 16700 },
  { level: 91, minPoints: 16700, maxPoints: 16900 },
  { level: 92, minPoints: 16900, maxPoints: 17100 },
  { level: 93, minPoints: 17100, maxPoints: 17300 },
  { level: 94, minPoints: 17300, maxPoints: 17500 },
  { level: 95, minPoints: 17500, maxPoints: 17700 },
  { level: 96, minPoints: 17700, maxPoints: 17900 },
  { level: 97, minPoints: 17900, maxPoints: 18100 },
  { level: 98, minPoints: 18100, maxPoints: 18300 },
  { level: 99, minPoints: 18300, maxPoints: 18500 },
  { level: 100, minPoints: 18500, maxPoints: 18700 },
];

interface ProgressionBarProps {
  points?: number | null;
}

export const ProgressionBar = ({ points }: ProgressionBarProps) => {
  const theme = useTheme();

  return (
    <Stack direction={'row'} spacing={1}>
      {progressionData.map((section, index) => {
        const calcWidth = points
          ? points - section.minPoints > 0
            ? ((points - section.minPoints) /
                (section.maxPoints - section.minPoints)) *
              100
            : 0
          : 0;

        return (
          <Box>
            <ProfilePageTypography fontSize={'14px'} lineHeight={'20px'}>
              {section.title}
            </ProfilePageTypography>
            <Box
              sx={{
                height: '16px',
                width: '100px',
                display: 'flex',
                marginTop: '8px',
                marginBottom: '8px',
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  width:
                    points && points > section.minPoints
                      ? '100%'
                      : `${calcWidth}%`,
                  backgroundColor: '#de85ff',
                  borderTopLeftRadius: index === 0 ? '16px' : '0px',
                  borderBottomLeftRadius: index === 0 ? '16px' : '0px',
                }}
              />
              <Box
                sx={{
                  height: '100%',
                  width:
                    points && points > section.minPoints
                      ? `${100 - calcWidth}%`
                      : '100%',
                  backgroundColor:
                    theme.palette.mode === 'light'
                      ? '#F9F5FF'
                      : alpha(theme.palette.white.main, 0.08),
                  borderTopRightRadius: index === 5 ? '16px' : '0px',
                  borderBottomRightRadius: index === 5 ? '16px' : '0px',
                }}
              />
            </Box>

            <ProfilePageTypography
              fontSize={'14px'}
              lineHeight={'20px'}
              fontWeight={400}
              style={{
                color: '#858585',
              }}
            >
              {section.minPoints}
            </ProfilePageTypography>
          </Box>
        );
      })}
    </Stack>
  );
};
