import type { WidgetConfig } from '@lifi/widget';
import { WidgetSkeleton as LifiWidgetSkeleton } from '@lifi/widget';
import { Box } from '@mui/material';

interface WidgetSkeletonProps {
  config?: Partial<WidgetConfig>;
}

export const WidgetSkeleton = ({ config }: WidgetSkeletonProps) => {
  return (
    <Box height="682px">
      <LifiWidgetSkeleton config={config} />
    </Box>
  );
};
