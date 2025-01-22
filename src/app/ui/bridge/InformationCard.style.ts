'use client';

import type { BoxProps, Breakpoint } from '@mui/material';
import { styled } from '@mui/material';
import { BridgePageContainer } from './BridgePage.style';

export const InformationCardContainer = styled(BridgePageContainer)<BoxProps>(
  ({ theme }) => ({
    [theme.breakpoints.up('md' as Breakpoint)]: {
      maxWidth: 'calc(50% - 16px)',
    },
  }),
);
