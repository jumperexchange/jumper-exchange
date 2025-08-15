import { FC, PropsWithChildren } from 'react';
import Container from '@mui/material/Container';

export const PageContainer: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Container
      sx={{
        px: { xs: 4 },
        mt: 6,
        mb: { xs: 12, md: 5.5 },
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
