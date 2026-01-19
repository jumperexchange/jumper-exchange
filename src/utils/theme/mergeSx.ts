import type { SxProps, Theme } from '@mui/material/styles';

export const mergeSx = (...sxProps: Array<SxProps<Theme> | undefined>) => {
  return sxProps.flatMap((sx) => {
    if (!sx) {
      return [];
    }
    return Array.isArray(sx) ? sx : [sx];
  });
};
