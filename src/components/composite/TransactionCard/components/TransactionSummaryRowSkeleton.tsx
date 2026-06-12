import type { FC } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';
import { BaseSurfaceSkeleton } from '@/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import {
  StyledDesktopRow,
  StyledPairRow,
  StyledRowContainer,
  StyledRowSection,
  StyledValueCell,
} from '../TransactionTable.styles';

const FieldSkeleton: FC<{ width?: number | string }> = ({ width = '60%' }) => (
  <Stack sx={{ gap: 0.5 }}>
    <BaseSurfaceSkeleton variant="rounded" sx={{ height: 16, width }} />
    <BaseSurfaceSkeleton variant="rounded" sx={{ height: 12, width: '40%' }} />
  </Stack>
);

const AvatarColumnSkeleton: FC = () => (
  <Stack sx={{ gap: 0.5 }}>
    <BaseSurfaceSkeleton variant="rounded" sx={{ height: 16, width: '50%' }} />
    <BaseSurfaceSkeleton variant="circular" sx={{ height: 32, width: 32 }} />
  </Stack>
);

const DesktopSkeleton: FC = () => (
  <StyledDesktopRow>
    <StyledValueCell>
      <FieldSkeleton width="70%" />
    </StyledValueCell>
    <StyledValueCell>
      <AvatarColumnSkeleton />
    </StyledValueCell>
    <StyledValueCell>
      <AvatarColumnSkeleton />
    </StyledValueCell>
    <StyledValueCell sx={{ flex: '0 0 auto' }}>
      <FieldSkeleton width={60} />
    </StyledValueCell>
    <StyledValueCell>
      <FieldSkeleton />
    </StyledValueCell>
    <StyledValueCell sx={{ alignItems: 'flex-end' }}>
      <FieldSkeleton />
    </StyledValueCell>
  </StyledDesktopRow>
);

const MobileSkeleton: FC = () => (
  <StyledRowContainer>
    <StyledRowSection>
      <StyledPairRow>
        <Box sx={{ flex: '1 1 0' }}>
          <FieldSkeleton />
        </Box>
        <Box sx={{ flex: '1 1 0' }}>
          <FieldSkeleton width="40%" />
        </Box>
      </StyledPairRow>
    </StyledRowSection>
    <StyledRowSection>
      <StyledPairRow>
        <Box sx={{ flex: '1 1 0' }}>
          <AvatarColumnSkeleton />
        </Box>
        <Box sx={{ flex: '1 1 0' }}>
          <AvatarColumnSkeleton />
        </Box>
      </StyledPairRow>
    </StyledRowSection>
    <StyledRowSection>
      <StyledPairRow>
        <Box sx={{ flex: '1 1 0' }}>
          <FieldSkeleton />
        </Box>
        <Box
          sx={{ flex: '1 1 0', display: 'flex', justifyContent: 'flex-end' }}
        >
          <FieldSkeleton />
        </Box>
      </StyledPairRow>
    </StyledRowSection>
  </StyledRowContainer>
);

export const TransactionSummaryRowSkeleton: FC = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  return isMobile ? <MobileSkeleton /> : <DesktopSkeleton />;
};
