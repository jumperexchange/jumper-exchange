import { FC, PropsWithChildren } from 'react';
import Container from '@mui/material/Container';

export const MissionsPageContainer: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Container
      sx={{
        px: { xl: 0, xs: 4 },
        mt: 5.5,
        mb: 5.5,
        maxWidth: 'lg',
        position: 'relative',
      }}
    >
      {children}
    </Container>
  );
};
