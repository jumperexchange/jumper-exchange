import { LineCustomSvgLayerProps, LineSeries } from '@nivo/line';
import { useTheme } from '@mui/material/styles';
import { format } from 'date-fns';

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

  const allData = data[0]?.data ?? [];
  const allTicks = allData.map((d) =>
    format(new Date(d.x as string), dateFormat ?? 'MMM yyyy'),
  );
  if (allTicks.length === 0) return null;

  // Minimum width required for each tick label to prevent overlap
  const minTickWidth = 80;

  // Calculate maximum number of ticks that can fit in the available width
  // Ensures at least 2 ticks and at most 7 ticks for readability
  const maxTicks = Math.max(
    2,
    Math.min(7, Math.floor(innerWidth / minTickWidth)),
  );

  // Calculate step size between ticks to evenly distribute them
  // Ensures we don't exceed the maximum number of ticks
  const step = Math.max(1, Math.floor(allTicks.length / maxTicks));

  // Calculate starting index to center the selected ticks
  // This ensures the tick selection is balanced around the center of the data
  const totalSpan = (maxTicks - 1) * step;
  const centerIndex = (allTicks.length - 1) / 2;
  const startIndex = Math.floor(centerIndex - totalSpan / 2);

  // Generate array of indices for the ticks to display
  // Each tick is spaced by 'step' intervals, starting from 'startIndex'
  // Ensures we never exceed the last available tick index
  const selectedIndices = Array.from({ length: maxTicks }, (_, i) =>
    Math.min(startIndex + i * step, allTicks.length - 1),
  );

  // Map selected indices to their corresponding tick labels
  const ticks = selectedIndices.map((index) => allTicks[index]);

  // Calculate horizontal positions for each tick based on their index
  // Positions are normalized to the inner width of the chart
  const positions = selectedIndices.map(
    (index) => (index / (allTicks.length - 1)) * innerWidth,
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
