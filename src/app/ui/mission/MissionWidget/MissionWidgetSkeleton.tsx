import { WidgetSkeleton } from '@lifi/widget/skeleton';
import { useThemeStore } from 'src/stores/theme/ThemeStore';

export const MissionWidgetSkeleton = () => {
  const [widgetTheme] = useThemeStore((state) => [
    state.widgetTheme,
    state.configTheme,
  ]);

  return (
    <WidgetSkeleton
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
