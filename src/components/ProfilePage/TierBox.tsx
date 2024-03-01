import {
  Box,
  Container,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';

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

export const TierBox = ({ points, tier }: any) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        borderRadius: '24px',

        backgroundColor:
          theme.palette.mode === 'light'
            ? '#FFFFFF'
            : alpha(theme.palette.white.main, 0.08),
        padding: '20px',
      }}
    >
      <Box sx={{}}>
        <Typography
          sx={{
            fontFamily: 'Inter',
            fontSize: '18px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '24px',
          }}
        >
          Tier
        </Typography>
      </Box>
      <Box
        sx={{
          marginTop: '24px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <Typography
            sx={{
              fontFamily: 'Inter',
              fontSize: '64px',
              fontStyle: 'normal',
              fontWeight: 700,
              lineHeight: '72px',
            }}
          >
            {points ?? 0}
          </Typography>
          <Typography
            sx={{
              color: '#858585',
              fontFamily: 'Inter',
              fontSize: '14px',
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: '20px',
              marginLegt: '8px',
              marginBottom: '8px',
            }}
          >
            {'points'}
          </Typography>
        </Box>
        {tier ? (
          <Box
            sx={{
              border: 8,
              borderColor:
                theme.palette.mode === 'light'
                  ? '#F9F5FF'
                  : alpha(theme.palette.white.main, 0.08),
              width: '168px',
              height: '80px',
              borderRadius: '24px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Inter',
                fontSize: '24px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: '32px' /* 125% */,
              }}
            >
              {tier ?? null}
            </Typography>
          </Box>
        ) : null}
      </Box>
      <Box>
        <Stack direction={'row'} spacing={1}>
          {progressionData.map((section, index) => {
            const calcWidth =
              points - section.minPoints > 0
                ? ((points - section.minPoints) /
                    (section.maxPoints - section.minPoints)) *
                  100
                : 0;

            return (
              <Box>
                <Typography
                  sx={{
                    fontFamily: 'Inter',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 700,
                    lineHeight: '20px',
                  }}
                >
                  {section.title}
                </Typography>
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
                        points > section.minPoints ? '100%' : `${calcWidth}%`,
                      backgroundColor: '#de85ff',
                      borderTopLeftRadius: index === 0 ? '16px' : '0px',
                      borderBottomLeftRadius: index === 0 ? '16px' : '0px',
                    }}
                  />
                  <Box
                    sx={{
                      height: '100%',
                      width:
                        points > section.minPoints
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
                <Typography
                  sx={{
                    color: '#858585',
                    fontFamily: 'Inter',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '20px',
                  }}
                >
                  {section.minPoints}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
};
