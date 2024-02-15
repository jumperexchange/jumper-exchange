import type { PropsWithChildren } from 'react';
import { BackgroundGradient, Navbar, PoweredBy, Snackbar } from './components';

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
      {children}
      <PoweredBy />
      <Snackbar />
    </>
  );
};
