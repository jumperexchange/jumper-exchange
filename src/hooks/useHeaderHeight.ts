import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { HeaderHeight } from '@/const/headerHeight';

export const useHeaderHeight = (): number => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'));
  const isSm = useMediaQuery(theme.breakpoints.up('sm'));

  if (isMd) {
    return HeaderHeight.MD;
  }
  if (isSm) {
    return HeaderHeight.SM;
  }
  return HeaderHeight.XS;
};
