import Background from '@/components/Background';
import type { PropsWithChildren } from 'react';
import { Navbar } from './components/Navbar/Navbar';
import { PartnerThemeFooterImage } from './components/PartnerThemeFooterImage';
import { Snackbar } from './components/Snackbar/Snackbar';
import { SupportModal } from './components/SupportModal/SupportModal';

interface LayoutProps {
  disableNavbar?: boolean;
}

export const Layout: React.FC<PropsWithChildren<LayoutProps>> = ({
  children,
  disableNavbar = false,
}) => {
  return (
    <>
      <Background />
      <Navbar disableNavbar={disableNavbar} />
      {children}
      <SupportModal />
      <Snackbar />
      <PartnerThemeFooterImage />
    </>
  );
};
