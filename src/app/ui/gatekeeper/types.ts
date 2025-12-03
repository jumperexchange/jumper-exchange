import type { SxProps, Theme } from '@mui/material/styles';

export interface GatekeeperIllustrations {
  mobile: {
    src: string;
    sx?: SxProps<Theme>;
  };
  desktop: {
    src: string;
    sx?: SxProps<Theme>;
  };
}
