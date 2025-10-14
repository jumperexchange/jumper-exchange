import { useTheme } from '@mui/material/styles';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CustomTooltip } from './CustomTooltip';
import { toCompactValue } from 'src/utils/formatNumbers';
import { LineChartSkeleton } from './LineChartSkeleton';
import {
  calculateTooltipPosition,
  calculateVisibleYRange,
  calculateEvenXAxisTicks,
} from './utils';
import { useCallback, useMemo, useRef } from 'react';
import { format } from 'date-fns';
import { AREA_CONFIG } from './constants';

export interface ChartDataPoint<V> {
  date: string;
  value: V;
}

export interface LineChartProps<V, T extends ChartDataPoint<V>> {
  data: T[];
  theme: {
    lineColor?: string;
    areaTopColor?: string;
    areaBottomColor?: string;
    pointColor?: string;
  };
  dateFormat?: string;
  dataSetId?: string;
  isLoading?: boolean;
  enableCrosshair?: boolean;
  enableGridY?: boolean;
  enableXAxis?: boolean;
  enableYAxis?: boolean;
  enableTooltip?: boolean;
}

export const LineChart = <V, T extends ChartDataPoint<V>>({
  data,
  theme,
  dateFormat,
  dataSetId,
  enableCrosshair = true,
  enableGridY = true,
  enableXAxis = true,
  enableYAxis = true,
  enableTooltip = true,
  isLoading,
}: LineChartProps<V, T>) => {
  const muiTheme = useTheme();
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const { minValue, maxValue, minValueWithOffset, maxValueWithOffset } =
    calculateVisibleYRange(data);

  const dateFormatter = useCallback(
    (date: string) => {
      return format(date ?? '', dateFormat ?? 'MMM yyyy');
    },
    [dateFormat],
  );

  const yAxisTickValues = useMemo(() => {
    const range = maxValue - minValue;
    const step = range / 4; // for 5 ticks, there are 4 steps
    return Array.from({ length: 5 }, (_, i) => minValue + step * i);
  }, [minValue, maxValue]);

  const xAxisTicks = useMemo(() => {
    return calculateEvenXAxisTicks(data, dateFormatter);
  }, [data, dateFormatter]);

  if (isLoading) {
    return <LineChartSkeleton />;
  }

  return (
    <ResponsiveContainer ref={chartContainerRef} width="100%" height="100%">
      <AreaChart data={data} accessibilityLayer={false}>
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={theme.areaTopColor} stopOpacity={1} />
            <stop
              offset="100%"
              stopColor={theme.areaBottomColor}
              stopOpacity={1}
            />
          </linearGradient>
        </defs>
        {enableGridY && (
          <CartesianGrid
            vertical={false}
            syncWithTicks={true}
            strokeDasharray="0"
            stroke={`color-mix(in srgb, ${
              (muiTheme.vars || muiTheme).palette.alpha900.main
            } 10%, transparent)`}
          />
        )}
        {enableXAxis && (
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            ticks={xAxisTicks}
            tickMargin={14}
            tick={{
              fill: (muiTheme.vars || muiTheme).palette.text.secondary,
              fontSize: 10,
              fontFamily: muiTheme.typography.bodyXXSmall.fontFamily,
              fontWeight: muiTheme.typography.bodyXXSmall.fontWeight,
            }}
            tickFormatter={dateFormatter}
          />
        )}
        {enableYAxis && (
          <YAxis
            axisLine={false}
            tickLine={false}
            ticks={yAxisTickValues}
            width={40}
            tickMargin={8}
            domain={[minValueWithOffset, maxValueWithOffset]}
            tick={{
              fill: (muiTheme.vars || muiTheme).palette.text.secondary,
              fontSize: 10,
              fontFamily: muiTheme.typography.bodyXXSmall.fontFamily,
              fontWeight: muiTheme.typography.bodyXXSmall.fontWeight,
            }}
            tickFormatter={(value) => {
              if (!value || isNaN(Number(value))) return value;
              if (Number(value) === 0) return '';
              return toCompactValue(value);
            }}
          />
        )}
        {enableTooltip && (
          <Tooltip
            content={(props) => {
              const { x, y } = calculateTooltipPosition(
                props.coordinate?.x ?? 0,
                props.coordinate?.y ?? 0,
                chartContainerRef.current?.clientWidth ?? 0,
                chartContainerRef.current?.clientHeight ?? 0,
              );
              return (
                <CustomTooltip {...props} x={x} y={y} dataSetId={dataSetId} />
              );
            }}
            cursor={false}
          />
        )}
        <Area
          type="monotone"
          dataKey="value"
          stroke={theme.lineColor}
          activeDot={
            enableCrosshair
              ? {
                  r: 4,
                  strokeWidth: 0,
                  fill: theme.pointColor,
                  style: {
                    transform: AREA_CONFIG.TRANSFORM,
                  },
                }
              : false
          }
          fillOpacity={1}
          fill="url(#areaGradient)"
          isAnimationActive
          baseValue="dataMin"
          style={{
            transform: AREA_CONFIG.TRANSFORM,
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
