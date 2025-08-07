import RouterLink from 'next/link';
import { cookies } from 'next/headers';

import { Logo } from './components/Logo/Logo';
import { NavbarContainer } from './Navbar.style';
import { Layout } from './layout/Layout';
import { Link } from '../Link';

import { checkIsLearnPage } from './utils';
import { AppPaths } from 'src/const/urls';

export const ServerNavbar = async () => {
  const cookieStore = await cookies();
  const pathname = cookieStore.get('pathname')?.value || '';
  const isLearnPage = checkIsLearnPage(pathname);

  return (
    <NavbarContainer enableColorOnDark>
      <Link component={RouterLink} href={AppPaths.Main}>
        <Logo variant="default" />
      </Link>
      <Layout hideConnectButton={isLearnPage} />
    </NavbarContainer>
  );
};
