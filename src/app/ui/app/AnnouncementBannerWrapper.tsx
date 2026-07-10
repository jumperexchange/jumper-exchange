import { AnnouncementBanner } from '@/components/AnnouncementBanner/AnnouncementBanner';
import type { AnnouncementBannerAlign } from '@/components/AnnouncementBanner/AnnouncementBanner.style';
import Box from '@mui/material/Box';
import type { FC, RefObject } from 'react';

interface AnnouncementBannerWrapperProps {
  ref?: RefObject<HTMLDivElement | null>;
  align?: AnnouncementBannerAlign;
}

export const AnnouncementBannerWrapper: FC<AnnouncementBannerWrapperProps> = ({
  ref,
  align = 'center',
}) => (
  <Box ref={ref}>
    <AnnouncementBanner align={align} />
  </Box>
);
