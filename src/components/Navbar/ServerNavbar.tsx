import { Logo } from './components/Logo/Logo';
import { NavbarContainer } from './Navbar.style';
import { Layout } from './layout/Layout';
import { Link } from '../Link';

import { AppPaths } from 'src/const/urls';

export const ServerNavbar = async () => {
  return (
    <NavbarContainer enableColorOnDark>
      <Link href={AppPaths.Main}>
        <Logo variant="default" />
      </Link>
      <Layout />
    </NavbarContainer>
  );
};
