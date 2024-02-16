import type { PropsWithChildren } from 'react';
import { BackgroundGradient, Navbar, PoweredBy, Snackbar } from './components';

interface LayoutProps {
  hideNavbarTabs?: boolean;
  variant?: 'blog' | undefined;
}
export const Layout: React.FC<PropsWithChildren<LayoutProps>> = ({
  children,
  variant,
  hideNavbarTabs,
}) => {
  return (
    <>
      <BackgroundGradient variant={variant} />
      <Navbar hideNavbarTabs={hideNavbarTabs} />
      {children}
      <PoweredBy />
      <Snackbar />
    </>
  );
};
