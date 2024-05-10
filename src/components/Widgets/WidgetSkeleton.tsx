import { Box } from '@mui/material';
import { WidgetSkeletonContainer } from './WidgetSkeleton.style';
import type { Appearance, WidgetConfig } from '@lifi/widget';
import { WidgetSkeleton as LifiWidgetSkeleton } from '@lifi/widget';

interface WidgetSkeletonProps {
  welcomeScreenClosed: boolean;
  config?: Partial<WidgetConfig>;
  appearance?: Appearance;
}

export const WidgetSkeleton = ({
  welcomeScreenClosed,
  config,
  appearance,
}: WidgetSkeletonProps) => {
  return (
    <Box height="682px">
      <WidgetSkeletonContainer welcomeScreenClosed={welcomeScreenClosed}>
        <LifiWidgetSkeleton config={{ ...config, appearance }} />
      </WidgetSkeletonContainer>
    </Box>
  );
};
