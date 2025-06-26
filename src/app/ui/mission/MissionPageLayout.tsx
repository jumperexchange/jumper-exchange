import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import React, { FC } from 'react';

interface MissionPageLayoutProps {
  leftColumn: React.ReactNode;
  rightColumn: React.ReactNode;
}

export const MissionPageLayout: FC<MissionPageLayoutProps> = ({
  leftColumn,
  rightColumn,
}) => {
  return (
    <Container
      sx={{ px: { xl: 0, xs: 4 }, mt: 5.5, mb: 5.5, maxWidth: '1112px' }}
    >
      <Stack
        sx={{
          alignItems: {
            xs: 'center',
            md: 'flex-start',
          },
          flexDirection: {
            xs: 'column',
            md: 'row',
          },
          gap: 4,
        }}
      >
        {leftColumn}
        {rightColumn}
      </Stack>
    </Container>
  );
};
