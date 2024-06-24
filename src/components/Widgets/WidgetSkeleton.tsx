import type { WidgetConfig } from '@lifi/widget';
import { WidgetSkeleton as LifiWidgetSkeleton } from '@lifi/widget';
import { Box } from '@mui/material';
import { WidgetSkeletonContainer } from './WidgetSkeleton.style';

interface WidgetSkeletonProps {
  config?: Partial<WidgetConfig>;
}

export const WidgetSkeleton = ({ config }: WidgetSkeletonProps) => {
  return (
    <Box height="682px">
      <WidgetSkeletonContainer welcomeScreenClosed={true}>
        {' '}
        <LifiWidgetSkeleton config={config} />
      </WidgetSkeletonContainer>
    </Box>
  );
};
