import { Box } from '@mui/material';
import type { PropsWithChildren } from 'react';
import { Navbar } from './components/Navbar/Navbar';
import { PoweredBy } from './components/PoweredBy/PoweredBy';
import { Snackbar } from './components/Snackbar/Snackbar';
import { SuperfestPresentedByBox } from './components/Superfest/SuperfestPresentedBy/SuperfestPresentedByBox';
import { SupportModal } from './components/SupportModal/SupportModal';
import Background from '@/components/Background';

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
      <Navbar />
      {children}
      <SupportModal />
      <Snackbar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row-reverse',
          justifyContent: 'space-between',
          alignItems: 'center',
          alignContent: 'center',
        }}
      >
        <PoweredBy fixedPosition={fixedPoweredBy} />
        <SuperfestPresentedByBox />
      </Box>
    </>
  );
};
