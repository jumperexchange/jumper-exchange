import { LiFiWidget } from '@lifi/widget';
import { useWidgetConfig } from '../../hooks/';

export function Widget({ starterVariant }) {
  const widgetConfig = useWidgetConfig((starterVariant = { starterVariant }));
  return (
    <LiFiWidget
      config={widgetConfig}
      integrator={(import.meta as ImportMeta).env.VITE_WIDGET_INTEGRATOR_STRING}
    />
  );
}
