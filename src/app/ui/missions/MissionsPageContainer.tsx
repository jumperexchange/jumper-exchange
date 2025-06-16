import { FC, PropsWithChildren } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

export const MissionsPageContainer: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Container sx={{ px: { xl: 0, xs: 4 }, mt: 5.5, mb: 5.5, maxWidth: 'lg' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(296px, 1fr))',
          gap: 4,
        }}
      >
        {children}
      </Box>
    </Container>
  );
};
