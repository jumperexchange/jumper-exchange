'use client';

import type { BoxProps, Breakpoint } from '@mui/system';
import { styled } from '@mui/system';
import { BridgePageContainer } from './BridgePage.style';

export const InformationCardContainer = styled(BridgePageContainer, {
  shouldForwardProp: (prop) => prop !== 'active',
})<BoxProps>(({ theme }) => ({
  [theme.breakpoints.up('md' as Breakpoint)]: {
    maxWidth: 'calc(50% - 16px)',
  },
}));
