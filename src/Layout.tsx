import type { PropsWithChildren } from 'react';
import { BackgroundGradient } from './components/BackgroundGradient/BackgroundGradient';
import { Navbar } from './components/Navbar/Navbar';
import { Snackbar } from './components/Snackbar/Snackbar';
import { SupportModal } from './components/SupportModal/SupportModal';

interface LayoutProps {
  fixedPoweredBy?: boolean | undefined;
}

export const Layout: React.FC<PropsWithChildren<LayoutProps>> = ({
  children,
  fixedPoweredBy,
}) => {
  return (
    <>
      <BackgroundGradient />
      <Navbar />
      {children}
      <SupportModal />
      <Snackbar />
    </>
  );
};
