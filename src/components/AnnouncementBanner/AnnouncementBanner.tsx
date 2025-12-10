'use client';
import type { FC } from 'react';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useAnnouncementStore } from '@/stores/announcements/AnnouncementStore';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import { AnimatePresence, motion } from 'motion/react';
import { RichBlocks } from '../RichBlocks/RichBlocks';
import {
  AnnouncementBannerContainer,
  AnnouncementBannerContainerList,
  AnnouncementBannerContentContainer,
} from './AnnouncementBanner.style';
import { useWidgetCacheStore } from 'src/stores/widgetCache/WidgetCacheStore';
import { openInNewTab } from 'src/utils/openInNewTab';
import { useRouter } from 'next/navigation';
import { isExternalUrl } from 'src/utils/urls/isExternalUrl';
import { parseNumber } from 'src/utils/numbers/utils';

interface AnnouncementBannerProps {
  maxAnnouncements?: number;
}

export const AnnouncementBanner: FC<AnnouncementBannerProps> = ({
  maxAnnouncements = 1,
}) => {
  const widgetCache = useWidgetCacheStore((state) => state);
  const router = useRouter();
  const { activeAnnouncements } = useAnnouncements();
  const dismissAnnouncement = useAnnouncementStore(
    (state) => state.dismissAnnouncement,
  );

  const displayedAnnouncements = activeAnnouncements.slice(0, maxAnnouncements);

  if (displayedAnnouncements.length === 0) {
    return null;
  }

  const handleRewriteLinkBehavior = (e: React.MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement)?.tagName?.toLowerCase() === 'a') {
      e.preventDefault();
      e.stopPropagation();

      const link = (e.target as HTMLElement).closest('a') as HTMLAnchorElement;
      const href = link.getAttribute('href');

      if (!href) {
        return;
      }

      if (isExternalUrl(href)) {
        openInNewTab(href);
        return;
      }

      if (/fromChain|toChain|fromToken|toToken/.test(href)) {
        const url = new URL(href, window.location.origin);
        const searchParams = url.searchParams;

        const fromChainId = parseNumber(searchParams.get('fromChain'));
        if (fromChainId !== undefined) {
          widgetCache.setFromChainId(fromChainId);
        }

        const fromToken = searchParams.get('fromToken');
        if (fromToken) {
          widgetCache.setFromToken(fromToken);
        }

        const toChainId = parseNumber(searchParams.get('toChain'));
        if (toChainId !== undefined) {
          widgetCache.setToChainId(toChainId);
        }

        const toToken = searchParams.get('toToken');
        if (toToken) {
          widgetCache.setToToken(toToken);
        }

        return;
      }

      router.push(href);
    }
  };

  return (
    <AnimatePresence mode="popLayout">
      <AnnouncementBannerContainerList>
        {displayedAnnouncements.map((announcement) => (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ duration: 0.3 }}
            key={announcement.documentId}
          >
            <AnnouncementBannerContainer onClick={handleRewriteLinkBehavior}>
              <AnnouncementBannerContentContainer>
                {announcement.logo ? (
                  <Avatar
                    src={announcement.logo.url}
                    alt={
                      announcement.logo.alternativeText || 'Announcement Logo'
                    }
                    sx={{ height: 24, width: 24 }}
                  />
                ) : null}
                <RichBlocks
                  content={announcement.content}
                  blockSx={{
                    paragraph: (theme) => ({
                      ...theme.typography.bodyXSmall,
                      '& a': {
                        marginLeft: 0,
                      },
                    }),
                  }}
                />
                {announcement.dismissible && (
                  <IconButton
                    onClick={() => dismissAnnouncement(announcement.documentId)}
                    aria-label="Dismiss announcement"
                    size="small"
                  >
                    <CloseIcon sx={{ height: 16, width: 16 }} />
                  </IconButton>
                )}
              </AnnouncementBannerContentContainer>
            </AnnouncementBannerContainer>
          </motion.div>
        ))}
      </AnnouncementBannerContainerList>
    </AnimatePresence>
  );
};
