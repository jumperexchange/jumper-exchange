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
import {
  formatValueWithConfig,
  type ValueFormatConfig,
} from 'src/utils/formatNumbers';
import { formatDateLocalized } from 'src/utils/formatDateLocalized';
import { LineChartSkeleton } from './LineChartSkeleton';
import {
  calculateTooltipPosition,
  calculateEvenXAxisTicks,
  calculateEvenYAxisTicks,
  calculateVisibleYRange,
} from './utils';
import { useCallback, useId, useMemo, useRef, useState } from 'react';
import type { HTMLAttributes } from 'react';
import Box from '@mui/material/Box';
import { AREA_CONFIG } from './constants';

import type { ActiveDotProps } from 'recharts/types/util/types';

const StyledResponsiveContainer = styled(ResponsiveContainer, {
  shouldForwardProp: (prop) => prop !== 'enableCrosshair',
})<{
  enableCrosshair?: boolean;
}>(({ enableCrosshair }) => ({
  '& *': {
    WebkitTapHighlightColor: 'transparent',
  },
  '& *:focus, & *:focus-visible, & *:focus-within': {
    outline: 'none !important',
    boxShadow: 'none !important',
  },
  '& .recharts-cartesian-grid, & .recharts-layer.recharts-area': {
    cursor: enableCrosshair ? 'crosshair' : 'default',
  },
}));

export interface ChartDataPoint<
  V extends number | string | null | undefined =
    | number
    | string
    | null
    | undefined,
> {
  date: string;
  value: V;
}

export interface LineChartProps<
  V extends number | string | null = number | string | null,
  T extends ChartDataPoint<V> = ChartDataPoint<V>,
> extends HTMLAttributes<HTMLDivElement> {
  data: T[];
  theme: {
    lineColor?: string;
    areaTopColor?: string;
    areaBottomColor?: string;
    pointColor?: string;
  };
  dateFormat?: string;
  dataSetId?: string;
  valueFormatConfig?: ValueFormatConfig;
  isLoading?: boolean;
  enableCrosshair?: boolean;
  enableGridY?: boolean;
  enableXAxis?: boolean;
  enableYAxis?: boolean;
  enableTooltip?: boolean;
}

export const LineChart = <
  V extends number | string | null = number | string | null,
  T extends ChartDataPoint<V> = ChartDataPoint<V>,
>({
  data,
  theme,
  dateFormat,
  dataSetId,
  valueFormatConfig,
  enableCrosshair = true,
  enableGridY = true,
  enableXAxis = true,
  enableYAxis = true,
  enableTooltip = true,
  isLoading,
  ...props
}: LineChartProps<V, T>) => {
  const muiTheme = useTheme();
  const gradientId = useId();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState<{
    cx: number;
    cy: number;
    payload: T;
  } | null>(null);

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
      return formatDateLocalized(date ?? '', dateFormat ?? 'MMM yyyy');
    },
    [dateFormat],
  );

  const valueFormatter = useCallback(
    (value: V) => {
      const numValue = Number(value);

      if (!value || isNaN(numValue) || numValue === 0) {
        return '0';
      }

      if (!valueFormatConfig) {
        return value.toString();
      }

      return formatValueWithConfig(numValue, valueFormatConfig, {
        includePrefixSuffix: true,
      });
    },
    [valueFormatConfig],
  );

  const yAxisTickValues = useMemo(() => {
    return calculateEvenYAxisTicks(minValue, maxValue);
  }, [minValue, maxValue]);

  const xAxisTicks = useMemo(() => {
    return calculateEvenXAxisTicks(data, dateFormatter);
  }, [data, dateFormatter]);

  const handleMouseLeave = useCallback(() => {
    setActiveDot(null);
  }, []);

  if (isLoading || !data || !data.length) {
    return <LineChartSkeleton />;
  }

  const tooltipPosition = activeDot
    ? calculateTooltipPosition(
        activeDot.cx,
        activeDot.cy,
        chartContainerRef.current?.clientWidth ?? 0,
        chartContainerRef.current?.clientHeight ?? 0,
      )
    : null;

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <StyledResponsiveContainer
        ref={chartContainerRef}
        width="100%"
        height="100%"
        enableCrosshair={enableCrosshair}
        {...props}
      >
        <AreaChart
          data={data}
          accessibilityLayer={false}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={theme.areaTopColor}
                stopOpacity={1}
              />
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
              tickMargin={8}
              width={60}
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
            connectNulls={true}
            activeDot={
              enableCrosshair
                ? (props: ActiveDotProps) => {
                    const { cx, cy, payload } = props;

                    // Skip null values - no dot, no tooltip
                    if (payload.value == null) {
                      if (enableTooltip) {
                        setActiveDot(null);
                      }
                      return null;
                    }

                    if (enableTooltip) {
                      setActiveDot((prev) => {
                        if (
                          prev?.payload.date === payload.date &&
                          prev?.payload.value === payload.value
                        ) {
                          return prev;
                        }
                        return {
                          cx: cx ?? 0,
                          cy: cy ?? 0,
                          payload,
                        };
                      });
                    }

                    return (
                      <g
                        style={{
                          cursor: 'crosshair',
                          transform: AREA_CONFIG.TRANSFORM,
                        }}
                      >
                        <circle
                          cx={cx}
                          cy={cy}
                          r={4}
                          strokeWidth={0}
                          fill={theme.pointColor}
                        />
                      </g>
                    );
                  }
                : false
            }
            fillOpacity={1}
            fill={`url(#${gradientId})`}
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
      {enableTooltip && activeDot && tooltipPosition && (
        <CustomTooltip
          active={true}
          payload={[
            {
              payload: activeDot.payload,
              value: activeDot.payload.value ?? undefined,
              graphicalItemId: dataSetId ?? '',
            },
          ]}
          label={activeDot.payload.date}
          x={tooltipPosition.x}
          y={tooltipPosition.y}
          transform={tooltipPosition.transform}
          dataSetId={dataSetId}
          valueFormatConfig={valueFormatConfig}
        />
      )}
    </Box>
  );
};
