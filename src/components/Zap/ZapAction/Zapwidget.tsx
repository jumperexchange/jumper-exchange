'use client';
import { useTheme } from '@mui/material';
import { Widget } from 'src/components/Widgets/Widget';
import type { WidgetProps } from 'src/components/Widgets/Widget.types';

export function ZapWidget({ starterVariant }: WidgetProps) {
  const theme = useTheme();
  const customWidgetTheme = {
    container: {
      boxShadow: 'unset',
      [theme.breakpoints.up('sm')]: {
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
