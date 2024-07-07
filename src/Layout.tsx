import type { PropsWithChildren } from 'react';
import { BackgroundGradient } from './components/BackgroundGradient/BackgroundGradient';
import { Navbar } from './components/Navbar/Navbar';
import { PoweredBy } from './components/PoweredBy/PoweredBy';
import { Snackbar } from './components/Snackbar/Snackbar';
import { SupportModal } from './components/SupportModal/SupportModal';
import Image from 'next/image';
import { SuperfestPresentedByBox } from './components/Superfest/SuperfestPresentedBy/SuperfestPresentedByBox';
import { Box } from '@mui/material';

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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          alignContent: 'center',
        }}
      >
        <SuperfestPresentedByBox />
        <PoweredBy fixedPosition={fixedPoweredBy} />
      </Box>
    </>
  );
};
