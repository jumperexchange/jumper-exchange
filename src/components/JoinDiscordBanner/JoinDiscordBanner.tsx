import type { Breakpoint } from '@mui/material';
import { Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TrackingAction, TrackingCategory } from 'src/const';
import { useUserTracking } from 'src/hooks';
import { EventTrackingTool } from 'src/types';
import { openInNewTab } from 'src/utils';
import { DiscordBanner } from '.';

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
      </Box>
    </DiscordBanner>
  );
};
