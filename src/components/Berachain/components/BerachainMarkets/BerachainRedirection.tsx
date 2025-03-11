import { Box, Typography } from '@mui/material';
import { BerachainRedirectionCTA } from './BerachainMarkets.style';

export const BerachainRedirection = () => {
  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: theme.spacing(8, 0),
        gap: theme.spacing(2),
        maxWidth: '600px',
        justifySelf: 'center',
        textAlign: 'center',
      })}
    >
      <Typography
        variant="urbanistBodyLarge"
        sx={(theme) => ({ color: theme.palette.text.primary })}
      >
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
