import { NotFoundWrapper } from '@/components/NotFound/NotFound.style';
import RouterLink from 'next/link';
import { Button } from '@mui/material';
import React from 'react';
import { Box } from '@mui/system';

export function NotFoundComponent() {
  return (
    <NotFoundWrapper>
      <h2>Page not found</h2>
      <Box component="p" sx={{ marginTop: 0, marginBottom: 4 }}>
        The page you are looking for does not exist.
      </Box>
      <Button component={RouterLink} href="/" variant="contained">
        Back to homepage
      </Button>
    </NotFoundWrapper>
  );
}
