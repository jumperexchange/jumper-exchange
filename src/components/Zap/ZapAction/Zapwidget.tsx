'use client';
import { Widget } from 'src/components/Widgets/Widget';
import type { WidgetProps } from 'src/components/Widgets/Widget.types';

export function ZapWidget({ starterVariant }: WidgetProps) {
  const customWidgetTheme = {
    container: {
      boxShadow: 'unset',
      '@media (min-width:600px)': {
        boxShadow: 'unset',
      },
    },
  };

  return (
    <Widget
      starterVariant={starterVariant}
      customWidgetTheme={customWidgetTheme}
    />
  );
}
