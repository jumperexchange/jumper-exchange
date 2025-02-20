import Background from '@/components/Background';
import type { PropsWithChildren } from 'react';
import { AbTests } from './components/AbTests';
import { Navbar } from './components/Navbar/Navbar';
import { PartnerThemeFooterImage } from './components/PartnerThemeFooterImage';
import { Snackbar } from './components/Snackbar/Snackbar';
import { SupportModal } from './components/SupportModal/SupportModal';

interface LayoutProps {
  fixedPoweredBy?: boolean | undefined;
  disableNavbar?: boolean;
}

export const Layout: React.FC<PropsWithChildren<LayoutProps>> = ({
  children,
  disableNavbar = false,
  fixedPoweredBy,
}) => {
  return (
    <>
      <Background />
      <Navbar disableNavbar={disableNavbar} />
      <AbTests />
      {children}
      <SupportModal />
      <Snackbar />
      <PartnerThemeFooterImage />
    </>
  );
};
