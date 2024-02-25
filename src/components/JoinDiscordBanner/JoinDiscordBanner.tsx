import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import type { Breakpoint } from '@mui/material';
import { Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DiscordBanner, DiscordBannerButton } from 'src/components';
import { TrackingAction, TrackingCategory } from 'src/const';
import { useUserTracking } from 'src/hooks';
import { EventTrackingTool } from 'src/types';
import { openInNewTab } from 'src/utils';

export const JoinDiscordBanner = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
  ) => {
    e.stopPropagation();
    trackEvent({
      category: TrackingCategory.DiscordBanner,
      action: TrackingAction.JoinDiscordCommunity,
      label: 'click-join-discord-community',
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Cookie3],
    });
    openInNewTab('https://discord.com/invite/lifi');
  };

  return (
    <DiscordBanner onClick={(e) => handleClick(e)}>
      <Typography
        variant="lifiHeaderMedium"
        sx={{
          textAlign: 'center',
          textDecoration: 'underline',
          fontFamily: 'Urbanist, Inter',
          fontSize: '32px',
          lineHeight: '44px',
          fontWeight: 700,
          [theme.breakpoints.up('sm' as Breakpoint)]: {
            fontSize: '40px',
            lineHeight: '56px',
            textDecoration: 'auto',
          },
        }}
      >
        {t('discordBanner.ctaHeadline')}
      </Typography>
      <DiscordBannerButton onClick={(e) => handleClick(e)}>
        <ArrowForwardIcon sx={{ width: '28px', height: '28px' }} />
      </DiscordBannerButton>
    </DiscordBanner>
  );
};
