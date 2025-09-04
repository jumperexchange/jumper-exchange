import {
  ResponsiveLine,
  LineLayerId,
  LineCustomSvgLayerProps,
  LineSeries,
  InferY,
  SliceTooltipProps,
} from '@nivo/line';
import { ReactNode } from 'react';
import { useTheme } from '@mui/material/styles';
import { CustomFollowingPointLayer } from './layers/CustomFollowingPointLayer';
import { CustomGridLayer } from './layers/CustomGridLayer';
import { CustomTooltip } from './CustomTooltip';
import { CustomYAxis } from './layers/CustomYAxis';
import { CustomXAxis } from './layers/CustomXAxis';
import { CustomAreaLayer } from './layers/CustomAreaLayer';

export interface LineChartProps<T extends LineSeries> {
  data: T[];
  lineColor?: string;
  areaColor?: string;
  pointColor?: string;
  enableCrosshair?: boolean;
  enableGridY?: boolean;
  enableXAxis?: boolean;
  enableYAxis?: boolean;
  dateFormat?: string;
}

export function LineChart<T extends LineSeries>({
  data,
  lineColor,
  areaColor,
  pointColor,
  enableCrosshair = false,
  enableGridY = false,
  enableXAxis = false,
  enableYAxis = false,
  dateFormat,
}: LineChartProps<T>) {
  const theme = useTheme();

  const buildLayers = (): (
    | LineLayerId
    | ((props: LineCustomSvgLayerProps<T>) => ReactNode)
  )[] => {
    const layers: (
      | LineLayerId
      | ((props: LineCustomSvgLayerProps<T>) => ReactNode)
    )[] = [];

    // Add axes and grid first (rendered behind the chart)
    if (enableGridY) {
      layers.push(CustomGridLayer);
    }

    if (enableYAxis) {
      layers.push(CustomYAxis);
    }

    if (enableXAxis) {
      layers.push((props: LineCustomSvgLayerProps<T>) => (
        <CustomXAxis {...props} dateFormat={dateFormat} />
      ));
    }

    // Add core chart layers
    layers.push(CustomAreaLayer, 'lines');

    // Add crosshair before slices (so it renders on top of the line but under tooltips)
    if (enableCrosshair) {
      layers.push((props: LineCustomSvgLayerProps<T>) => (
        <CustomFollowingPointLayer {...props} customPointColor={pointColor} />
      ));
    }

    // Add slices last (for tooltips)
    layers.push('slices');

    return layers;
  };

  const layers = buildLayers();

  return (
    <ResponsiveLine<T>
      data={data}
      margin={{ top: 20, right: 60, bottom: 20, left: 60 }}
      yScale={{
        type: 'linear',
        min: 'auto',
        max: 'auto',
        stacked: true,
        reverse: false,
      }}
      lineWidth={1}
      curve="cardinal"
      animate
      isInteractive
      enableSlices="x"
      sliceTooltip={(props: SliceTooltipProps<T>) => (
        <CustomTooltip {...props} dateFormat={dateFormat} />
      )}
      colors={[lineColor || (theme.vars || theme).palette.primary.main]}
      defs={[
        {
          id: 'gradient',
          type: 'linearGradient',
          colors: [
            {
              offset: 0,
              color: areaColor || (theme.vars || theme).palette.primary.main,
            },
            { offset: 100, color: 'white' },
          ],
        },
      ]}
      fill={[{ match: '*', id: 'gradient' }]}
      layers={layers}
    />
  );
}
