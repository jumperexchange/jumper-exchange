import { ButtonPrimary } from '@/components/Button';
import { NotFoundWrapper } from '@/components/NotFound/NotFound.style';
import { Box } from '@mui/material';
import RouterLink from 'next/link';

export function NotFoundComponent() {
  return (
    <NotFoundWrapper>
      <h2>Page not found</h2>
      <Box component="p" sx={{ marginTop: 0, marginBottom: 4 }}>
        The page you are looking for does not exist.
      </Box>
      <ButtonPrimary component={RouterLink} href="/">
        Back to homepage
      </ButtonPrimary>
    </NotFoundWrapper>
  );
}
