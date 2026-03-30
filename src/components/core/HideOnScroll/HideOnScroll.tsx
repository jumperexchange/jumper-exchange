'use client';

import Slide from '@mui/material/Slide';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { navbarHideOnScrollTriggerOptions } from '@/const/navbar';
import type { FC, ReactElement } from 'react';

interface HideOnScrollProps {
  children: ReactElement;
}

export const HideOnScroll: FC<HideOnScrollProps> = ({ children }) => {
  const trigger = useScrollTrigger(navbarHideOnScrollTriggerOptions);

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
};
