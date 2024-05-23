import type { WidgetConfig } from '@lifi/widget';
import { WidgetSkeleton as LifiWidgetSkeleton } from '@lifi/widget';
import { Box } from '@mui/material';
import { WidgetSkeletonContainer } from './WidgetSkeleton.style';

interface WidgetSkeletonProps {
  welcomeScreenClosed: boolean;
  config?: Partial<WidgetConfig>;
}

export const WidgetSkeleton = ({
  welcomeScreenClosed,
  config,
}: WidgetSkeletonProps) => {
  return (
    <Box height="682px">
      <WidgetSkeletonContainer welcomeScreenClosed={welcomeScreenClosed}>
        <LifiWidgetSkeleton config={config} />
      </WidgetSkeletonContainer>
    </Box>
  );
};
