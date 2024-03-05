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
