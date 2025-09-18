import { FC } from 'react';
import { LiFiWidget } from '@lifi/widget';
import { WidgetProps } from './Widget.types';
import { useWidgetConfig } from '../widgetConfig/useWidgetConfig';

export const Widget: FC<WidgetProps> = ({ ctx, type, formRef, feeConfig }) => {
  const widgetConfig = useWidgetConfig(type, ctx);

  return (
    <LiFiWidget
      config={widgetConfig}
      integrator={widgetConfig.integrator}
      formRef={formRef}
      feeConfig={feeConfig}
    />
  );
};
