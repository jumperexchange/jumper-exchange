import { styled, useTheme } from '@mui/material/styles';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { CustomTooltip } from './CustomTooltip';
import { toCompactValue } from 'src/utils/formatNumbers';
import { LineChartSkeleton } from './LineChartSkeleton';
import {
  calculateTooltipPosition,
  calculateVisibleYRange,
  calculateEvenXAxisTicks,
  calculateEvenYAxisTicks,
} from './utils';
import { useCallback, useMemo, useRef } from 'react';
import { format } from 'date-fns';
import { AREA_CONFIG } from './constants';
import { ActiveDotProps } from 'recharts/types/util/types';

const StyledResponsiveContainer = styled(ResponsiveContainer, {
  shouldForwardProp: (prop) => prop !== 'enableCrosshair',
})<{
  enableCrosshair?: boolean;
}>(({ enableCrosshair }) => ({
  '& .recharts-cartesian-grid, & .recharts-layer.recharts-area': {
    cursor: enableCrosshair ? 'crosshair' : 'default',
  },
}));

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

  const {
    minValue,
    maxValue,
    minValueWithOffset,
    maxValueWithOffset,
    isSymmetricRange,
    isNegative,
  } = calculateVisibleYRange(data);

  const dateFormatter = useCallback(
    (date: string) => {
      return format(date ?? '', dateFormat ?? 'MMM yyyy');
    },
    [dateFormat],
  );

  const valueFormatter = useCallback((value: T) => {
    if (!value || isNaN(Number(value))) {
      return value.toString();
    }

    const numberValue = Number(value);

    if (numberValue === 0) {
      return '';
    }

    return toCompactValue(numberValue).toString();
  }, []);

  const yAxisTickValues = useMemo(() => {
    return calculateEvenYAxisTicks(minValue, maxValue);
  }, [minValue, maxValue]);

  const xAxisTicks = useMemo(() => {
    return calculateEvenXAxisTicks(data, dateFormatter);
  }, [data, dateFormatter]);

  if (isLoading) {
    return <LineChartSkeleton />;
  }

  return (
    <StyledResponsiveContainer
      ref={chartContainerRef}
      width="100%"
      height="100%"
      enableCrosshair={enableCrosshair}
    >
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
            horizontalFill={['transparent']}
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
            width={48}
            tickMargin={8}
            domain={[minValueWithOffset, maxValueWithOffset]}
            tick={{
              fill: (muiTheme.vars || muiTheme).palette.text.secondary,
              fontSize: 10,
              fontFamily: muiTheme.typography.bodyXXSmall.fontFamily,
              fontWeight: muiTheme.typography.bodyXXSmall.fontWeight,
            }}
            tickFormatter={valueFormatter}
          />
        )}
        <Area
          type="monotone"
          dataKey="value"
          stroke={theme.lineColor}
          activeDot={
            enableCrosshair
              ? (props: ActiveDotProps) => {
                  const { cx, cy, payload } = props;
                  const { x, y, transform } = calculateTooltipPosition(
                    cx,
                    cy,
                    chartContainerRef.current?.clientWidth ?? 0,
                    chartContainerRef.current?.clientHeight ?? 0,
                  );

                  return (
                    <g style={{ cursor: 'crosshair' }}>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={4}
                        strokeWidth={0}
                        fill={theme.pointColor}
                        style={{
                          transform: AREA_CONFIG.TRANSFORM,
                        }}
                      />
                      {enableTooltip && (
                        <foreignObject
                          x={x}
                          y={y}
                          width={1}
                          height={1}
                          style={{ overflow: 'visible' }}
                        >
                          <CustomTooltip
                            active={true}
                            payload={[{ payload, value: payload.value }]}
                            label={payload.date}
                            x={0}
                            y={0}
                            transform={transform}
                            dataSetId={dataSetId}
                          />
                        </foreignObject>
                      )}
                    </g>
                  );
                }
              : false
          }
          fillOpacity={1}
          fill="url(#areaGradient)"
          isAnimationActive
          baseValue={isNegative ? 0 : 'dataMin'}
          style={{
            transform: AREA_CONFIG.TRANSFORM,
          }}
        />
        {isSymmetricRange && (
          <ReferenceLine
            type="monotone"
            y={0}
            stroke={(muiTheme.vars || muiTheme).palette.text.primary}
            opacity={0.5}
          />
        )}
      </AreaChart>
    </StyledResponsiveContainer>
  );
};
