import type { PropsWithChildren } from 'react';
import { BackgroundGradient, Navbar, PoweredBy, Snackbar } from './components';

interface LayoutProps {
  hideNavbarTabs?: boolean;
  redirectConnect?: boolean;
  variant?: 'blog' | undefined;
  fixedPosition?: boolean;
}
export const Layout: React.FC<PropsWithChildren<LayoutProps>> = ({
  children,
  variant,
  hideNavbarTabs,
  redirectConnect,
  fixedPosition,
}) => {
  return (
    <>
      <BackgroundGradient variant={variant} />
      <Navbar
        hideNavbarTabs={hideNavbarTabs}
        redirectConnect={redirectConnect}
      />
      {children}
      <PoweredBy fixedPosition={fixedPosition} />
      <Snackbar />
    </>
  );
};
