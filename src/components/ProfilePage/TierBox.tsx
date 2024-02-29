import { Box, Container, Stack, Typography } from '@mui/material';

export const TierBox = ({ points, tier }: any) => {
  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        borderRadius: '24px',
        backgroundColor: '#FFFFFF',
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
            {points ?? null}
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
        <Box
          sx={{
            border: 8,
            borderColor: '#f9f5ff',
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
      </Box>
      <Box>
        <Typography>Graduation</Typography>
      </Box>
    </Box>
  );
};
