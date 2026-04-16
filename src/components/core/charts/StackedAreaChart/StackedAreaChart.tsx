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
  calculateVisibleYRange,
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
  base: number | null;
  reward: number | null;
  intrinsic: number | null;
  total: number | null;
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
    intrinsicLineColor?: string;
    intrinsicAreaTopColor?: string;
    intrinsicAreaBottomColor?: string;
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
  const points = data
    .filter(
      (d): d is StackedChartDataPoint & { total: number } => d.total != null,
    )
    .map((d) => ({
      date: d.date,
      value: d.total,
    }));

  return calculateVisibleYRange(points);
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
  const intrinsicGradientId = useId();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState<{
    cx: number;
    cy: number;
    payload: StackedChartDataPoint;
  } | null>(null);

  const enrichedData = useMemo(
    () =>
      data.map((point) => ({
        ...point,
        baseReward:
          point.base != null || point.reward != null
            ? (point.base ?? 0) + (point.reward ?? 0)
            : null,
      })),
    [data],
  );

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
    const adaptedData = enrichedData
      .filter(
        (d): d is (typeof enrichedData)[number] & { total: number } =>
          d.total != null,
      )
      .map((d) => ({
        date: d.date,
        value: d.total,
      }));
    return calculateEvenXAxisTicks(adaptedData, dateFormatter);
  }, [enrichedData, dateFormatter]);

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

    if (payload.total == null) {
      if (enableTooltip) {
        setActiveDot(null);
      }
      return null;
    }

    if (enableTooltip) {
      setActiveDot((prev) => {
        if (
          prev?.payload.date === payload.date &&
          prev?.payload.base === payload.base &&
          prev?.payload.reward === payload.reward &&
          prev?.payload.intrinsic === payload.intrinsic
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

  if (isLoading || !data || !data.length) {
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
          data={enrichedData}
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
            <linearGradient
              id={intrinsicGradientId}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor={theme.intrinsicAreaTopColor}
                stopOpacity={1}
              />
              <stop
                offset="100%"
                stopColor={theme.intrinsicAreaBottomColor}
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
          {/* Total area (intrinsic gradient) - rendered first as full-stack background */}
          <Area
            type="monotone"
            dataKey="total"
            stroke={theme.intrinsicLineColor}
            connectNulls={true}
            fillOpacity={1}
            fill={`url(#${intrinsicGradientId})`}
            isAnimationActive
            activeDot={enableCrosshair ? handleActiveDot : false}
            style={{
              transform: AREA_CONFIG.TRANSFORM,
            }}
          />
          {/* Base+reward area (reward gradient) - overlays up to reward boundary */}
          <Area
            type="monotone"
            dataKey="baseReward"
            stroke="transparent"
            connectNulls={true}
            fillOpacity={1}
            fill={`url(#${rewardGradientId})`}
            isAnimationActive
            activeDot={false}
            style={{
              transform: AREA_CONFIG.TRANSFORM,
            }}
          />
          {/* Base+reward divider line (separates reward from intrinsic) */}
          <Area
            type="monotone"
            dataKey="baseReward"
            stroke={theme.rewardLineColor}
            connectNulls={true}
            fillOpacity={0}
            fill="transparent"
            isAnimationActive
            activeDot={false}
            style={{
              transform: AREA_CONFIG.TRANSFORM,
            }}
          />
          {/* Base area - overlays bottom portion */}
          <Area
            type="monotone"
            dataKey="base"
            stroke="transparent"
            connectNulls={true}
            fillOpacity={1}
            fill={`url(#${baseGradientId})`}
            isAnimationActive
            activeDot={false}
            style={{
              transform: AREA_CONFIG.TRANSFORM,
            }}
          />
          {/* Base line (divider between base and reward) */}
          <Area
            type="monotone"
            dataKey="base"
            stroke={theme.baseLineColor}
            connectNulls={true}
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
