import type { PropsWithChildren } from 'react';
import {
  BackgroundGradient,
  Menus,
  Navbar,
  PoweredBy,
  Snackbar,
} from './components';

interface LayoutProps {
  hideNavbarTabs?: boolean;
}
export const Layout: React.FC<PropsWithChildren<LayoutProps>> = ({
  children,
  hideNavbarTabs,
}) => {
  return (
    <>
      <BackgroundGradient />
      <Navbar hideNavbarTabs={hideNavbarTabs} />
      <Menus />
      {children}
      <PoweredBy />
      <Snackbar />
    </>
  );
};
