import { WidgetSkeleton as LiFiWidgetSkeleton } from '@lifi/widget/skeleton';
import { useThemeStore } from 'src/stores/theme/ThemeStore';

export const WidgetSkeleton = () => {
  const [widgetTheme] = useThemeStore((state) => [
    state.widgetTheme,
    state.configTheme,
  ]);

  return (
    <LiFiWidgetSkeleton
      config={{
        variant: 'compact',
        appearance: widgetTheme.config.appearance,
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
