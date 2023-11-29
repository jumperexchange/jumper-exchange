import type { Breakpoint, Theme } from '@mui/material';

import useMediaQuery from '@mui/material/useMediaQuery';
import { LogoLarge, LogoSmall } from 'src/components';

type LogoProps = {
  isConnected: boolean;
  theme: Theme;
};

export const Logo = ({ isConnected, theme }: LogoProps) => {
  const isTablet = useMediaQuery(theme.breakpoints.up('sm' as Breakpoint));

  return !isTablet || (!isTablet && isConnected) ? (
    <LogoSmall theme={theme} />
  ) : (
    <LogoLarge theme={theme} />
  );
};
