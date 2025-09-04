import { LineCustomSvgLayerProps, LineSeries } from '@nivo/line';
import { useTheme } from '@mui/material/styles';

export const CustomYAxis = <T extends LineSeries>({
  yScale,
  margin,
}: LineCustomSvgLayerProps<T>) => {
  const theme = useTheme();
  const linearYScale = yScale as any;

  const [yMin, yMax] = linearYScale.domain();
  const ticks = Array.from(
    { length: 5 },
    (_, i) => yMin + (i * (yMax - yMin)) / (5 - 1),
  );

  return (
    <g transform={`translate(-10, 0)`}>
      {ticks.map((tickValue, i) => {
        const y = linearYScale(tickValue);
        return (
          <g key={i} transform={`translate(0 ,${y})`}>
            <text
              textAnchor="end"
              dominantBaseline="middle"
              style={{
                fontSize: theme.typography.bodyXXSmall.fontSize,
                fontWeight: theme.typography.bodyXXSmall.fontWeight,
                fontFamily: theme.typography.bodyXXSmall.fontFamily,
                fill: (theme.vars || theme).palette.text.secondary,
              }}
            >
              {tickValue.toFixed(0)}
            </text>
          </g>
        );
      })}
    </g>
  );
};
