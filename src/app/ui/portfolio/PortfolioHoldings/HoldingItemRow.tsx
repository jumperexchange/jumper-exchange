import { StyledContent } from '@/components/core/sections/ExpandableSection/ExpandableSection.style';
import type { PropsWithChildren } from 'react';

export const HoldingItemRow = ({ children }: PropsWithChildren) => (
  <StyledContent
    hideCursor={false}
    direction="row"
    spacing={2}
    useFlexGap
    justifyContent="space-between"
    alignItems="center"
  >
    {children}
  </StyledContent>
);
