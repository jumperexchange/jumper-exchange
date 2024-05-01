import { NotFoundWrapper } from '@/components/NotFound/NotFound.style';
import RouterLink from 'next/link';
import { Link, Typography } from '@mui/material';

export function NotFoundComponent() {
  return (
    <NotFoundWrapper>
      <h2>Not Found</h2>

      <p>We are sorry, we could not find requested resource.</p>
      <Link component={RouterLink} href="/" color="#fff">
          Bring me back to the homepage
      </Link>
    </NotFoundWrapper>
  );
}
