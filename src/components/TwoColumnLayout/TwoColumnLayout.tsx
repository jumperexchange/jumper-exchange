import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import type { SxProps, Theme } from '@mui/material/styles';
import type { FC, ReactNode } from 'react';
import React from 'react';
import { mergeSx } from '@/utils/theme/mergeSx';

interface TwoColumnLayoutProps {
  mainContent: ReactNode;
  sideContent: ReactNode;
  shouldStretchSideContent?: boolean;
  isSideExpanded?: boolean;
  sx?: SxProps<Theme>;
}

export const TwoColumnLayout: FC<TwoColumnLayoutProps> = ({
  mainContent,
  sideContent,
  shouldStretchSideContent = false,
  isSideExpanded = false,
  sx,
}) => {
  return (
    <Stack
      sx={mergeSx(
        {
          justifyContent: 'center',
          alignItems: {
            xs: 'center',
            lg:
              shouldStretchSideContent || isSideExpanded
                ? 'stretch'
                : 'flex-start',
          },
          flexDirection: {
            xs: 'column',
            lg: 'row',
          },
          gap: 4,
          width: isSideExpanded ? '100%' : undefined,
          transition: 'width 280ms ease-out',
        },
        sx,
      )}
    >
      <Box
        sx={{
          maxWidth: { xs: '100%', md: '664px', lg: '640px' },
          width: '100%',
          flex: isSideExpanded ? '0 0 auto' : undefined,
        }}
      >
        {mainContent}
      </Box>
      <Box
        sx={{
          maxWidth: isSideExpanded
            ? 'none'
            : { xs: '100%', md: '664px', lg: '408px' },
          width: '100%',
          flex: isSideExpanded || shouldStretchSideContent ? 1 : 'auto',
          minWidth: isSideExpanded ? 0 : undefined,
          transition: 'max-width 280ms ease-out, flex 280ms ease-out',
        }}
      >
        {sideContent}
      </Box>
    </Stack>
  );
};
