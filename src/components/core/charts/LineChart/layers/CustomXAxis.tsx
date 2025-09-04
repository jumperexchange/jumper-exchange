import { InferX, LineCustomSvgLayerProps, LineSeries } from '@nivo/line';
import { useTheme } from '@mui/material/styles';
import { format } from 'date-fns';
import { uniq } from 'lodash';

export interface CustomXAxisProps<T extends LineSeries>
  extends LineCustomSvgLayerProps<T> {
  dateFormat?: string;
}

export const CustomXAxis = <T extends LineSeries>({
  innerHeight,
  innerWidth,
  data,
  dateFormat,
}: CustomXAxisProps<T>) => {
  const theme = useTheme();
  const ticks = uniq(
    (data[0]?.data ?? []).map((d) =>
      format(new Date(d.x as string), dateFormat ?? 'MMM yyyy'),
    ),
  );
  if (ticks.length === 0) return null;

  const slotWidth = innerWidth / ticks.length;
  const positions = Array.from(
    { length: ticks.length },
    (_, i) => i * slotWidth + slotWidth / 2,
  );

  return (
    <g transform={`translate(0, ${innerHeight + 10})`}>
      {positions.map((position, i) => {
        const value = ticks[i];
        return (
          <g key={i} transform={`translate(${position},0)`}>
            <text
              textAnchor="middle"
              dominantBaseline="hanging"
              style={{
                fontSize: theme.typography.bodyXXSmall.fontSize,
                fontWeight: theme.typography.bodyXXSmall.fontWeight,
                fontFamily: theme.typography.bodyXXSmall.fontFamily,
                fill: (theme.vars || theme).palette.text.secondary,
              }}
            >
              {value}
            </text>
          </g>
        );
      })}
    </g>
  );
};
