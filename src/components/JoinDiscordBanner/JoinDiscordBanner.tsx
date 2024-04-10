'use client';
import { TrackingAction, TrackingCategory } from '@/const/trackingKeys';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { EventTrackingTool } from '@/types/userTracking';
import { isArticlePage } from '@/utils/isArticlePage';
import { openInNewTab } from '@/utils/openInNewTab';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { DiscordBanner, DiscordBannerButton, DiscordBannerLabel } from '.';

export const JoinDiscordBanner = () => {
  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();
  const currentPath = usePathname();
  const isArticle = isArticlePage(
    `${process.env.NEXT_PUBLIC_SITE_URL}/${currentPath}`,
  );
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
    <DiscordBanner onClick={(e) => handleClick(e)} isArticlePage={isArticle}>
      <DiscordBannerLabel variant="lifiHeaderMedium">
        {t('discordBanner.ctaHeadline')}
      </DiscordBannerLabel>
      <DiscordBannerButton onClick={(e) => handleClick(e)}>
        <ArrowForwardIcon sx={{ width: '28px', height: '28px' }} />
      </DiscordBannerButton>
    </DiscordBanner>
  );
};
