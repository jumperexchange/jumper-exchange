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
          textAlign={'center'}
          margin={theme.spacing(12, 'auto', 0)}
          maxWidth={theme.breakpoints.values.sm}
          color={
            theme.palette.mode === 'light'
              ? theme.palette.black.main
              : theme.palette.black.main
          }
        >
          {t('discordBanner.ctaHeadline')}
        </Typography>
        <Button
          onClick={handleClick}
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
            {t('discordBanner.ctaButton')}
          </Typography>
        </Button>
      </Box>
    </DiscordBanner>
  );
};
