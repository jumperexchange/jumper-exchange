'use client';

import { TrackingAction, TrackingCategory } from '@/const/trackingKeys';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { isArticlePage } from '@/utils/isArticlePage';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { DISCORD_URL_INVITE, getSiteUrl } from 'src/const/urls';
import { DiscordBannerButton, DiscordBannerLabel, DiscordBannerLink } from '.';
import type { SxProps, Theme } from '@mui/material/styles';
import type { FC } from 'react';

interface JoinDiscordBannerProps {
  sx?: SxProps<Theme>;
}

export const JoinDiscordBanner: FC<JoinDiscordBannerProps> = ({ sx }) => {
  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();
  const currentPath = usePathname();
  const isArticle = isArticlePage(`${getSiteUrl()}/${currentPath}`);
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    trackEvent({
      category: TrackingCategory.DiscordBanner,
      action: TrackingAction.JoinDiscordCommunity,
      label: 'click-join-discord-community',
    });
  };

  return (
    <DiscordBannerLink
      href={DISCORD_URL_INVITE}
      onClick={(e) => handleClick(e)}
      sx={sx}
    >
      <DiscordBannerLabel variant="headerMedium">
        {t('discordBanner.ctaHeadline')}
      </DiscordBannerLabel>
      <DiscordBannerButton
        aria-label="Open discord link"
        onClick={(e) => handleClick(e)}
      >
        <ArrowForwardIcon sx={{ width: '28px', height: '28px' }} />
      </DiscordBannerButton>
    </DiscordBannerLink>
  );
};
