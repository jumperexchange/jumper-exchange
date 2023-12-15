import { useWallet } from '@lifi/widget';
import { useTheme } from '@mui/material';
import { LogoLink } from '../Navbar';

import { Logo } from 'src/components';
import { NavbarContainer } from './ErrorBoundary.style';

export const ErrorBoundary = () => {
  const theme = useTheme();
  const { account } = useWallet();
  return (
    <NavbarContainer>
      <LogoLink>
        <Logo isConnected={!!account.address} theme={theme} />
      </LogoLink>
    </NavbarContainer>
  );
};
