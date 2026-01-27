import { WidgetSkeleton as LiFiWidgetSkeleton } from '@lifi/widget/skeleton';
import { useWidgetTheme } from 'src/hooks/theme/useWidgetTheme';

export const WidgetSkeleton = () => {
  const widgetTheme = useWidgetTheme();

  return (
    <LiFiWidgetSkeleton
      config={{
        variant: 'compact',
        theme: {
          ...widgetTheme.config.theme,
          container: {
            maxHeight: 820,
            maxWidth: 'unset',
            borderRadius: 24,
          },
        },
      }}
    />
  );
};
