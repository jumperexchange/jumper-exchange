import { styled, useTheme } from '@mui/material/styles';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { StackedAreaTooltip } from './StackedAreaTooltip';
import {
  formatValueWithConfig,
  type ValueFormatConfig,
} from 'src/utils/formatNumbers';
import { formatDateLocalized } from 'src/utils/formatDateLocalized';
import { LineChartSkeleton } from '../LineChart/LineChartSkeleton';
import {
  calculateTooltipPosition,
  calculateEvenXAxisTicks,
  calculateEvenYAxisTicks,
} from '../LineChart/utils';
import { useCallback, useId, useMemo, useRef, useState } from 'react';
import type { HTMLAttributes } from 'react';
import Box from '@mui/material/Box';
import { AREA_CONFIG } from '../LineChart/constants';

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

export interface StackedChartDataPoint {
  date: string;
  base: number;
  reward: number;
}

export interface StackedAreaChartProps extends HTMLAttributes<HTMLDivElement> {
  data: StackedChartDataPoint[];
  theme: {
    baseLineColor?: string;
    baseAreaTopColor?: string;
    baseAreaBottomColor?: string;
    rewardLineColor?: string;
    rewardAreaTopColor?: string;
    rewardAreaBottomColor?: string;
    pointColor?: string;
  };
  dateFormat?: string;
  valueFormatConfig?: ValueFormatConfig;
  isLoading?: boolean;
  enableCrosshair?: boolean;
  enableGridY?: boolean;
  enableXAxis?: boolean;
  enableYAxis?: boolean;
  enableTooltip?: boolean;
}

const calculateStackedVisibleYRange = (data: StackedChartDataPoint[]) => {
  if (data.length === 0) {
    return {
      minValue: 0,
      maxValue: 1,
      minValueWithOffset: 0,
      maxValueWithOffset: 1,
    };
  }

  const totals = data.map((d) => d.base + d.reward);
  const dataMaxValue = Math.max(...totals);

  const minValue = 0;
  const maxValue = dataMaxValue > 0 ? dataMaxValue * 1.2 : 1;

  return {
    minValue,
    maxValue,
    minValueWithOffset: minValue,
    maxValueWithOffset: maxValue,
  };
};

export const StackedAreaChart = ({
  data,
  theme,
  dateFormat,
  valueFormatConfig,
  enableCrosshair = true,
  enableGridY = true,
  enableXAxis = true,
  enableYAxis = true,
  enableTooltip = true,
  isLoading,
  ...props
}: StackedAreaChartProps) => {
  const muiTheme = useTheme();
  const baseGradientId = useId();
  const rewardGradientId = useId();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState<{
    cx: number;
    cy: number;
    payload: StackedChartDataPoint;
  } | null>(null);

  const { minValue, maxValue, minValueWithOffset, maxValueWithOffset } =
    calculateStackedVisibleYRange(data);

  const dateFormatter = useCallback(
    (date: string) => {
      return formatDateLocalized(date ?? '', dateFormat ?? 'MMM yyyy');
    },
    [dateFormat],
  );

  const valueFormatter = useCallback(
    (value: number) => {
      if (isNaN(value)) {
        return '0';
      }

      if (!valueFormatConfig) {
        return value.toString();
      }

      return formatValueWithConfig(value, valueFormatConfig, {
        includePrefixSuffix: true,
      });
    },
    [valueFormatConfig],
  );

  const yAxisTickValues = useMemo(() => {
    return calculateEvenYAxisTicks(minValue, maxValue);
  }, [minValue, maxValue]);

  const xAxisTicks = useMemo(() => {
    // Adapt the data format for calculateEvenXAxisTicks
    const adaptedData = data.map((d) => ({
      date: d.date,
      value: d.base + d.reward,
    }));
    return calculateEvenXAxisTicks(adaptedData, dateFormatter);
  }, [data, dateFormatter]);

  const handleMouseLeave = useCallback(() => {
    setActiveDot(null);
  }, []);

  if (isLoading) {
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

  const handleActiveDot = (props: ActiveDotProps) => {
    const { cx, cy, payload } = props;

    if (enableTooltip) {
      setActiveDot((prev) => {
        if (
          prev?.payload.date === payload.date &&
          prev?.payload.base === payload.base &&
          prev?.payload.reward === payload.reward
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
        <circle cx={cx} cy={cy} r={4} strokeWidth={0} fill={theme.pointColor} />
      </g>
    );
  };

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
            <linearGradient id={baseGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={theme.baseAreaTopColor}
                stopOpacity={1}
              />
              <stop
                offset="100%"
                stopColor={theme.baseAreaBottomColor}
                stopOpacity={1}
              />
            </linearGradient>
            <linearGradient id={rewardGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={theme.rewardAreaTopColor}
                stopOpacity={1}
              />
              <stop
                offset="100%"
                stopColor={theme.rewardAreaBottomColor}
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
          {/* Base area fill (bottom of stack, no stroke) */}
          <Area
            type="monotone"
            dataKey="base"
            stackId="apy"
            stroke="transparent"
            fillOpacity={1}
            fill={`url(#${baseGradientId})`}
            isAnimationActive
            activeDot={false}
            style={{
              transform: AREA_CONFIG.TRANSFORM,
            }}
          />
          {/* Reward area (stacked on top of base) - dot appears here */}
          <Area
            type="monotone"
            dataKey="reward"
            stackId="apy"
            stroke={theme.rewardLineColor}
            fillOpacity={1}
            fill={`url(#${rewardGradientId})`}
            isAnimationActive
            activeDot={enableCrosshair ? handleActiveDot : false}
            style={{
              transform: AREA_CONFIG.TRANSFORM,
            }}
          />
          {/* Base line rendered last (always on top in z-order) */}
          <Area
            type="monotone"
            dataKey="base"
            stroke={theme.baseLineColor}
            fillOpacity={0}
            fill="transparent"
            isAnimationActive
            activeDot={false}
            style={{
              transform: AREA_CONFIG.TRANSFORM,
            }}
          />
        </AreaChart>
      </StyledResponsiveContainer>
      {enableTooltip && activeDot && tooltipPosition && (
        <StackedAreaTooltip
          active={true}
          payload={activeDot.payload}
          label={activeDot.payload.date}
          x={tooltipPosition.x}
          y={tooltipPosition.y}
          transform={tooltipPosition.transform}
          valueFormatConfig={valueFormatConfig}
        />
      )}
    </Box>
  );
};
