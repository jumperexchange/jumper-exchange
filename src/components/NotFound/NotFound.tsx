import { NotFoundWrapper } from '@/components/NotFound/NotFound.style';
import RouterLink from 'next/link';
import { Button } from '@mui/material';
import React from 'react';

export function NotFoundComponent() {
  return (
    <NotFoundWrapper>
      <h2>404 Not Found</h2>
      <p>We are sorry, we could not find requested resource.</p>
      <Button component={RouterLink} href="/" variant="contained">
        Back to homepage
      </Button>
    </NotFoundWrapper>
  );
}
