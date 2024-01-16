import { Box, Typography, useTheme } from '@mui/material';
import { DiscordBanner } from '.';
import { Button } from '../Button';
import { Discord } from '../illustrations';

export const JoinDiscordBanner = () => {
  const theme = useTheme();
  return (
    <DiscordBanner>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography
          variant="lifiHeaderMedium"
          textAlign={'center'}
          margin={theme.spacing(12, 'auto', 0)}
          maxWidth={theme.breakpoints.values.sm}
          color={
            theme.palette.mode === 'light'
              ? theme.palette.black.main
              : theme.palette.black.main
          }
        >
          Level Up Your Crypto Knowledge: Connect with Our Community
        </Typography>
        <Button
          styles={{
            padding: theme.spacing(0, 2),
            margin: theme.spacing(4, 'auto', 12),
          }}
          variant="primary"
        >
          <Discord
            color={
              theme.palette.mode === 'light'
                ? theme.palette.white.main
                : theme.palette.grey[100]
            }
          />
          <Typography marginLeft={theme.spacing(0.5)}>
            Join our Discord Community
          </Typography>
        </Button>
      </Box>
    </DiscordBanner>
  );
};
