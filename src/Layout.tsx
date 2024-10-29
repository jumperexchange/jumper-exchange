import type { PropsWithChildren } from 'react';
import { Navbar } from './components/Navbar/Navbar';
import Background from '@/components/Background';
import dynamic from 'next/dynamic';

interface LayoutProps {
  fixedPoweredBy?: boolean | undefined;
  disableNavbar?: boolean;
}

const SupportModal = dynamic(() =>
  import('./components/SupportModal/SupportModal').then((s) => s.SupportModal),
);
const Snackbar = dynamic(() =>
  import('./components/Snackbar/Snackbar').then((s) => s.Snackbar),
);
const PartnerThemeFooterImage = dynamic(() =>
  import('./components/PartnerThemeFooterImage').then(
    (s) => s.PartnerThemeFooterImage,
  ),
);

export const Layout: React.FC<PropsWithChildren<LayoutProps>> = ({
  children,
  disableNavbar = false,
  fixedPoweredBy,
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
