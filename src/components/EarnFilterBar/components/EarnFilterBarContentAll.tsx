import { FC, PropsWithChildren } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { EarnFilterBarContentAllDesktop } from '../layouts/EarnFilterBarContentAllDesktop';
import { EarnFilterBarContentAllMobile } from '../layouts/EarnFilterBarContentAllMobile';

export const EarnFilterBarContentAll: FC<PropsWithChildren> = ({
  children,
}) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return isMobile ? (
    <EarnFilterBarContentAllMobile />
  ) : (
    <EarnFilterBarContentAllDesktop>{children}</EarnFilterBarContentAllDesktop>
  );
};
