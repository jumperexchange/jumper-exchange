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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

export interface ChartDataPoint<V extends number | string = number | string> {
  date: string;
  value: V;
}

export interface LineChartProps<
  V extends number | string = number | string,
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
  V extends number | string = number | string,
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
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const tooltipDataRef = useRef<{
    x: number;
    y: number;
    transform: string;
    payload: T;
  } | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const [, forceUpdate] = useState({});

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

  const scheduleTooltipUpdate = useCallback(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    rafIdRef.current = requestAnimationFrame(() => {
      forceUpdate({});
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    tooltipDataRef.current = null;
    scheduleTooltipUpdate();
  }, [scheduleTooltipUpdate]);

  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  if (isLoading) {
    return <LineChartSkeleton />;
  }

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
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
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
            activeDot={
              enableCrosshair
                ? (props: ActiveDotProps) => {
                    const { cx, cy, payload } = props;
                    const { x, y, transform } = calculateTooltipPosition(
                      cx ?? 0,
                      cy ?? 0,
                      chartContainerRef.current?.clientWidth ?? 0,
                      chartContainerRef.current?.clientHeight ?? 0,
                    );

                    const prev = tooltipDataRef.current;
                    if (
                      enableTooltip &&
                      (!prev ||
                        prev.payload.date !== payload.date ||
                        prev.payload.value !== payload.value)
                    ) {
                      tooltipDataRef.current = { x, y, transform, payload };
                      scheduleTooltipUpdate();
                    }

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
      {enableTooltip && tooltipDataRef.current && (
        <CustomTooltip
          active={true}
          payload={[
            {
              payload: tooltipDataRef.current.payload,
              value: tooltipDataRef.current.payload.value,
            },
          ]}
          label={tooltipDataRef.current.payload.date}
          x={tooltipDataRef.current.x}
          y={tooltipDataRef.current.y}
          transform={tooltipDataRef.current.transform}
          dataSetId={dataSetId}
          valueFormatConfig={valueFormatConfig}
        />
      )}
    </Box>
  );
};
