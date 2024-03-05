import type { PropsWithChildren } from 'react';
import { BackgroundGradient, Navbar, Snackbar } from './components';

interface LayoutProps {
  hideNavbarTabs?: boolean;
  redirectToLearn?: boolean;
  variant?: 'blog' | undefined;
}
export const Layout: React.FC<PropsWithChildren<LayoutProps>> = ({
  children,
  variant,
  hideNavbarTabs,
  redirectToLearn,
}) => {
  return (
    <>
      <BackgroundGradient variant={variant} />
      <Navbar
        hideNavbarTabs={hideNavbarTabs}
        redirectToLearn={redirectToLearn}
      />
      {children}
      <Snackbar />
    </>
  );
};
