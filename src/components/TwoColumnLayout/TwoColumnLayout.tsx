import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import React, { FC, ReactNode } from 'react';

interface TwoColumnLayoutProps {
  mainContent: ReactNode;
  sideContent: ReactNode;
  shouldStretchSideContent?: boolean;
}

export const TwoColumnLayout: FC<TwoColumnLayoutProps> = ({
  mainContent,
  sideContent,
  shouldStretchSideContent = false,
}) => {
  return (
    <Stack
      sx={{
        justifyContent: 'center',
        alignItems: {
          xs: 'center',
          lg: shouldStretchSideContent ? 'stretch' : 'flex-start',
        },
        flexDirection: {
          xs: 'column',
          lg: 'row',
        },
        gap: 4,
      }}
    >
      <Box
        sx={{
          maxWidth: { xs: '100%', md: '664px', lg: '640px' },
          width: '100%',
        }}
      >
        {mainContent}
      </Box>
      <Box
        sx={{
          maxWidth: { xs: '100%', md: '664px', lg: '408px' },
          width: '100%',
          flex: shouldStretchSideContent ? 1 : 'auto',
        }}
      >
        {sideContent}
      </Box>
    </Stack>
  );
};
