import { useTheme } from '@mui/material/styles';
import { LineCustomSvgLayerProps, LineSeries } from '@nivo/line';

interface CustomGridLayerProps<T extends LineSeries>
  extends LineCustomSvgLayerProps<T> {
  gridPadding?: number;
}

export const CustomGridLayer = <T extends LineSeries>({
  xScale,
  yScale,
  width,
  margin,
  gridPadding = 0.01,
}: CustomGridLayerProps<T>) => {
  const theme = useTheme();
  const gridWidth = width - (margin.left || 0) - (margin.right || 0);
  const padding = gridWidth * gridPadding;

  // Ensure scale is linear
  const linearYScale = yScale as any;

  const yMin = linearYScale.domain?.()[0];
  const yMax = linearYScale.domain()[1];

  const ticks = Array.from(
    { length: 5 },
    (_, i) => yMin + (i * (yMax - yMin)) / (5 - 1),
  );

  return (
    <g style={{ pointerEvents: 'auto' }}>
      {ticks
        .filter((tickValue: number) => tickValue !== 0)
        .map((tickValue: number) => {
          const y = linearYScale(tickValue);
          return (
            <line
              key={tickValue}
              x1={padding}
              x2={gridWidth - padding}
              y1={y}
              y2={y}
              stroke={`color-mix(in srgb, ${
                (theme.vars || theme).palette.alpha900.main
              } 10%, transparent)`}
              strokeWidth={1}
            />
          );
        })}
    </g>
  );
};
