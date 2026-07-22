import type { FC, PropsWithChildren } from 'react';
import Container from '@mui/material/Container';

interface PageContainerProps extends PropsWithChildren {
  /** Relaxes the max-width for pages whose content needs more breathing room
   * than the default 1080px content column (e.g. wide dashboards/widgets). */
  wide?: boolean;
}

export const PageContainer: FC<PageContainerProps> = ({ children, wide }) => {
  return (
    <Container
      sx={{
        px: { xs: 2, md: 4 },
        pb: { xs: 8, md: 18 },
        mt: 6,
        // We need to cover a width of 1080px + paddingX
        maxWidth: wide ? '1440px !important' : '1144px !important',
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
