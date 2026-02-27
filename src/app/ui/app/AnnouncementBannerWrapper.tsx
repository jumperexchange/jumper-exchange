import { AnnouncementBanner } from '@/components/AnnouncementBanner/AnnouncementBanner';
import Box from '@mui/material/Box';
import type { FC, RefObject } from 'react';

interface AnnouncementBannerWrapperProps {
  ref: RefObject<HTMLDivElement | null>;
}

export const AnnouncementBannerWrapper: FC<AnnouncementBannerWrapperProps> = ({
  ref,
}) => (
  <Box
    sx={{
      '& > :last-child': {
        marginBottom: `16px`,
      },
    }}
    ref={ref}
  >
    <AnnouncementBanner />
  </Box>
);
