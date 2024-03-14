import type { Breakpoint, Theme } from '@mui/material';

import useMediaQuery from '@mui/material/useMediaQuery';
import type { ReactNode } from 'react';
import { JumperIcon } from 'src/components';

type LogoProps = {
  isConnected: boolean;
  theme: Theme;
  logo: ReactNode;
};

export const Logo = ({ isConnected, theme, logo }: LogoProps) => {
  const isTablet = useMediaQuery(theme.breakpoints.up('sm' as Breakpoint));

  return !isTablet || (!isTablet && isConnected) ? <JumperIcon /> : logo;
};
