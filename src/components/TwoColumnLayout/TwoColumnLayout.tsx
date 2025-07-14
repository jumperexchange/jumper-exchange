import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
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
    <Container
      sx={{
        px: { lg: 0, xs: 4 },
        mt: 5.5,
        mb: 5.5,
        maxWidth: '1112px !important',
      }}
    >
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
        <Box sx={{ maxWidth: { xs: '100%', md: '664px' }, width: '100%' }}>
          {mainContent}
        </Box>
        <Box
          sx={{
            maxWidth: { xs: '100%', md: '664px', lg: '416px' },
            width: '100%',
            flex: shouldStretchSideContent ? 1 : 'auto',
          }}
        >
          {sideContent}
        </Box>
      </Stack>
    </Container>
  );
};
