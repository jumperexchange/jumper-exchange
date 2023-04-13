import { LiFiWidget } from '@lifi/widget';
import { useWidgetConfig } from '../../hooks/';

export function Widget({ starterVariant }) {
  const widgetConfig = useWidgetConfig((starterVariant = { starterVariant }));
  return (
    <LiFiWidget
      integrator={
        (import.meta.env as ImportMetaEnv).VITE_WIDGET_INTEGRATOR as string
      }
      config={widgetConfig}
    />
  );
}
