import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import Link from 'next/link';
import { BerachainRedirectionCTA } from './BerachainMarkets.style';

export const BerachainRedirection = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 64,
      }}
    >
      <Typography variant="urbanistTitleMedium">
        To withdraw your deposits and claim your rewards head over to the Boyco
        website
      </Typography>
      <a
        style={{
          textDecoration: 'none',
          color: 'inherit',
          position: 'relative',
        }}
        href="https://berachain.royco.org/portfolio"
        target="_blank"
        rel="noopener noreferrer"
      >
        <BerachainRedirectionCTA>
          <Typography variant="bodySmallStrong">Claim your assets</Typography>
        </BerachainRedirectionCTA>
      </a>
    </Box>
  );
};
