import type { SxProps, Theme } from '@mui/material/styles';

export interface GatekeeperIllustrations {
  illustration: React.ReactNode;
  mobile: {
    sx?: SxProps<Theme>;
  };
  desktop: {
    sx?: SxProps<Theme>;
  };
}
