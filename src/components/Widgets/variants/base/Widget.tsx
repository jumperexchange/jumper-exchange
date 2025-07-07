import { FC } from 'react';
import { useLiFiWidgetConfig } from '../widgetConfig/hooks';
import { LiFiWidget } from '@lifi/widget';
import { WidgetProps } from './Widget.types';

export const Widget: FC<WidgetProps> = ({ ctx }) => {
  const widgetConfig = useLiFiWidgetConfig(ctx);

  return (
    <LiFiWidget config={widgetConfig} integrator={widgetConfig.integrator} />
  );
};
