'use client';
import { FC } from 'react';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useAnnouncementStore } from '@/stores/announcements';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import { AnimatePresence, motion } from 'framer-motion';
import { RichBlocks } from '../RichBlocks/RichBlocks';
import {
  AnnouncementBannerContainer,
  AnnouncementBannerContainerList,
  AnnouncementBannerContentContainer,
} from './AnnouncementBanner.style';

interface AnnouncementBannerProps {
  maxAnnouncements?: number;
}

export const AnnouncementBanner: FC<AnnouncementBannerProps> = ({
  maxAnnouncements = 1,
}) => {
  const { activeAnnouncements } = useAnnouncements();
  const dismissAnnouncement = useAnnouncementStore(
    (state) => state.dismissAnnouncement,
  );

  const displayedAnnouncements = activeAnnouncements.slice(0, maxAnnouncements);

  const handleDismiss = (uid: string) => {
    dismissAnnouncement(uid);
  };

  if (displayedAnnouncements.length === 0) {
    return null;
  }

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
            <AnnouncementBannerContainer>
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
                    }),
                  }}
                />
                {announcement.dismissible && (
                  <IconButton
                    onClick={() => handleDismiss(announcement.documentId)}
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
