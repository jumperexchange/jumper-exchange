import type { Breakpoint } from '@mui/material';
import { Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TrackingAction, TrackingCategory } from 'src/const';
import { useUserTracking } from 'src/hooks';
import { EventTrackingTool } from 'src/types';
import { openInNewTab } from 'src/utils';
import { DiscordBanner } from '.';
import { Button } from '../Button';
import { Discord } from '../illustrations';

export const JoinDiscordBanner = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();

  const handleClick = () => {
    trackEvent({
      category: TrackingCategory.DiscordBanner,
      action: TrackingAction.JoinDiscordCommunity,
      label: 'click-join-discord-community',
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Cookie3],
    });
    openInNewTab('https://discord.com/invite/lifi');
  };
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
          sx={{
            textAlign: 'center',
            margin: theme.spacing(0, 'auto'),
            fontFamily: 'Urbanist, Inter',
            fontSize: '32px',
            lineHeight: '44px',
            fontWeight: 700,
            [theme.breakpoints.up('sm' as Breakpoint)]: {
              fontSize: '48px',
              lineHeight: '58px',
            },
          }}
        >
          {t('discordBanner.ctaHeadline')}
        </Typography>
        <Button
          onClick={handleClick}
          styles={{
            padding: theme.spacing(0, 4.5),
            margin: 'auto',
            marginTop: theme.spacing(4),
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
            {t('discordBanner.ctaButton')}
          </Typography>
        </Button>
      </Box>
    </DiscordBanner>
  );
};
