import Background from '@/components/Background';
import type { PropsWithChildren } from 'react';
import { PartnerThemeFooterImage } from './components/PartnerThemeFooterImage';
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
      <Background />
      {/* <AbTests /> */}
      {children}
      <SupportModal />
      <Snackbar />
      <PartnerThemeFooterImage />
    </>
  );
};
