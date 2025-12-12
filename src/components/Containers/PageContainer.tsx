import type { FC, PropsWithChildren } from 'react';
import Container from '@mui/material/Container';

export const PageContainer: FC<PropsWithChildren> = ({ children }) => {
  console.log('14. PageContainer');

  return (
    <Container
      sx={{
        px: { xs: 2, md: 4 },
        pb: { xs: 8, md: 18 },
        mt: 6,
        // We need to cover a width of 1080px + paddingX
        maxWidth: '1144px !important',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      {children}
    </Container>
  );
};
