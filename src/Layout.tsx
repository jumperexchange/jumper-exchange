import type { PropsWithChildren } from 'react';
import { BackgroundGradient } from './components/BackgroundGradient/BackgroundGradient';
import { Navbar } from './components/Navbar/Navbar';
import { Snackbar } from './components/Snackbar/Snackbar';

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
      <Navbar />
      {children}
      <Snackbar />
    </>
  );
};
