'use client';

import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { WidgetSkeleton } from '@/components/Widgets/variants/base/WidgetSkeleton';

interface WidgetPageSkeletonProps {
  showTitle?: boolean;
}

export const WidgetPageSkeleton = ({
  showTitle = true,
}: WidgetPageSkeletonProps) => {
  return (
    <Container>
      <Stack
        direction="column"
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {showTitle && (
          <Skeleton
            variant="rounded"
            sx={{
              width: { xs: '100%', sm: 600 },
              maxWidth: '100%',
              height: 48,
              my: 2,
              borderRadius: 2,
            }}
          />
        )}
        <WidgetSkeleton />
      </Stack>
    </Container>
  );
};
