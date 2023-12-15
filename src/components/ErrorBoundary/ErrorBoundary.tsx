import { useWallet } from '@lifi/widget';
import type { Breakpoint } from '@mui/material';
import { Typography, useTheme } from '@mui/material';
import { LogoLink } from '../Navbar';

import { Logo } from 'src/components';
import { CenteredContainer, NavbarContainer } from './ErrorBoundary.style';

export const ErrorBoundary = () => {
  const theme = useTheme();
  const { account } = useWallet();
  return (
    <>
      <NavbarContainer>
        <LogoLink>
          <Logo isConnected={!!account.address} theme={theme} />
        </LogoLink>
      </NavbarContainer>
      <CenteredContainer>
        <Typography
          variant={'lifiBodyLarge'}
          sx={{
            color:
              theme.palette.mode === 'dark'
                ? theme.palette.accent1Alt.main
                : theme.palette.primary.main,
            fontWeight: 700,
            [theme.breakpoints.up('sm' as Breakpoint)]: {
              fontSize: '24px',
              fontWeight: 400,
              lineHeight: '32px',
            },
          }}
        >
          We encountered a major Error. Please try reloading the page. If the
          problem persists, contact our support.
        </Typography>
      </CenteredContainer>
    </>
  );
};
