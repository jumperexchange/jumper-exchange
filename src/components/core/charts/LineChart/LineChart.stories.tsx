import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ChartDataPoint, LineChart, LineChartProps } from './LineChart';
import { LineChartSkeleton } from './LineChartSkeleton';
import Box from '@mui/material/Box';
import { useColorScheme, useTheme } from '@mui/material/styles';

const data = [
  { date: '2023-01-01', value: 97.92 },
  { date: '2023-01-02', value: 124.45 },
  { date: '2023-01-03', value: 86.26 },
  { date: '2023-01-04', value: 97.28 },
  { date: '2023-01-05', value: 91.52 },
  { date: '2023-01-07', value: 130.35 },
  { date: '2023-01-08', value: 83.77 },
  { date: '2023-01-09', value: 103.57 },
  { date: '2023-01-10', value: 102.31 },
  { date: '2023-01-11', value: 119.63 },
  { date: '2023-01-12', value: 100.87 },
  { date: '2023-01-13', value: 88.29 },
  { date: '2023-01-15', value: 103.58 },
  { date: '2023-01-16', value: 87.97 },
  { date: '2023-01-17', value: 90.75 },
  { date: '2023-01-18', value: 111.31 },
  { date: '2023-01-20', value: 108.49 },
  { date: '2023-01-21', value: 105.54 },
  { date: '2023-01-22', value: 85.69 },
  { date: '2023-01-23', value: 108.31 },
  { date: '2023-01-24', value: 90.05 },
  { date: '2023-01-25', value: 105.59 },
  { date: '2023-02-06', value: 100.71 },
  { date: '2023-03-14', value: 96.55 },
  { date: '2023-04-19', value: 137.6 },
];

const meta = {
  component: LineChart,
  title: 'Core/Charts/LineChart',
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultRenderer = <V, T extends ChartDataPoint<V>>(
  args: LineChartProps<V, T>,
) => {
  const theme = useTheme();
  const { mode } = useColorScheme();
  const isLightTheme = mode === 'light';
  return (
    <Box sx={{ height: 400 }}>
      <LineChart
        {...args}
        theme={{
          areaTopColor: isLightTheme
            ? `#F2D9F6`
            : (theme.vars || theme).palette.accent2Alt,
          areaBottomColor: isLightTheme
            ? (theme.vars || theme).palette.white.main
            : (theme.vars || theme).palette.bg.main,
          pointColor: (theme.vars || theme).palette.accent1.main,
          lineColor: (theme.vars || theme).palette.accent2.main,
          ...args.theme,
        }}
      />
    </Box>
  );
};

const commonArgs = {
  data,
  theme: {},
  dateFormat: 'dd MMM yyyy',
  dataSetId: 'tvl',
};

export const Default: Story = {
  render: DefaultRenderer,
  args: {
    ...commonArgs,
  },
};

export const CustomColors: Story = {
  render: DefaultRenderer,
  args: {
    ...commonArgs,
    theme: {
      ...commonArgs.theme,
      lineColor: '#FF8C42',
      areaTopColor: '#FFF2E6',
      pointColor: '#E65100',
    },
  },
};

export const DailyTVL: Story = {
  render: DefaultRenderer,
  args: {
    ...commonArgs,
    dateFormat: 'dd MMM',
    data: [
      { date: '2023-01-01', value: 100 },
      { date: '2023-01-02', value: 230 },
      { date: '2023-01-03', value: 120 },
      { date: '2023-01-04', value: 150 },
      { date: '2023-01-05', value: 100 },
      { date: '2023-01-06', value: 67 },
    ],
  },
};

export const MonthlyTVL: Story = {
  render: DefaultRenderer,
  args: {
    ...commonArgs,
    dateFormat: 'MMM yyyy',
    data: [
      { date: '2025-09-01', value: 32.51 },
      { date: '2025-10-01', value: 31.11 },
      { date: '2025-11-01', value: 27.02 },
      { date: '2025-12-01', value: 27.32 },
      { date: '2026-01-01', value: 25.17 },
      { date: '2026-02-01', value: 28.89 },
      { date: '2026-03-01', value: 25.46 },
      { date: '2026-04-01', value: 23.92 },
      { date: '2026-05-01', value: 22.68 },
      { date: '2026-06-01', value: 22.67 },
      { date: '2026-07-01', value: 23.92 },
      { date: '2026-08-01', value: 22.68 },
      { date: '2026-09-01', value: 22.67 },
      { date: '2026-10-01', value: 28.67 },
    ],
  },
};

export const OnlyWithBaseLayers: Story = {
  render: DefaultRenderer,
  args: {
    ...commonArgs,
    enableCrosshair: false,
    enableGridY: false,
    enableXAxis: false,
    enableYAxis: false,
    enableTooltip: false,
  },
};

export const Skeleton: Story = {
  render: () => (
    <Box sx={{ height: 400 }}>
      <LineChartSkeleton />
    </Box>
  ),
  args: {
    ...commonArgs,
  },
};

// Edge Cases: Testing calculateVisibleYRange logic

export const NegativeValuesSame: Story = {
  render: DefaultRenderer,
  args: {
    ...commonArgs,
    data: [
      { date: '2023-01-01', value: -5 },
      { date: '2023-01-02', value: -5 },
      { date: '2023-01-03', value: -5 },
      { date: '2023-01-04', value: -5 },
      { date: '2023-01-05', value: -5 },
    ],
  },
};

export const NegativeValuesSameSmall: Story = {
  render: DefaultRenderer,
  args: {
    ...commonArgs,
    data: [
      { date: '2023-01-01', value: -0.5 },
      { date: '2023-01-02', value: -0.5 },
      { date: '2023-01-03', value: -0.5 },
      { date: '2023-01-04', value: -0.5 },
      { date: '2023-01-05', value: -0.5 },
    ],
  },
};

export const NegativeValuesVarying: Story = {
  render: DefaultRenderer,
  args: {
    ...commonArgs,
    data: [
      { date: '2023-01-01', value: -10 },
      { date: '2023-01-02', value: -25 },
      { date: '2023-01-03', value: -5 },
      { date: '2023-01-04', value: -15 },
      { date: '2023-01-05', value: -20 },
      { date: '2023-01-06', value: -8 },
    ],
  },
};

export const PositiveValuesSame: Story = {
  render: DefaultRenderer,
  args: {
    ...commonArgs,
    data: [
      { date: '2023-01-01', value: 100 },
      { date: '2023-01-02', value: 100 },
      { date: '2023-01-03', value: 100 },
      { date: '2023-01-04', value: 100 },
      { date: '2023-01-05', value: 100 },
    ],
  },
};

export const PositiveValuesSameSmall: Story = {
  render: DefaultRenderer,
  args: {
    ...commonArgs,
    data: [
      { date: '2023-01-01', value: 0.5 },
      { date: '2023-01-02', value: 0.5 },
      { date: '2023-01-03', value: 0.5 },
      { date: '2023-01-04', value: 0.5 },
      { date: '2023-01-05', value: 0.5 },
    ],
  },
};

export const MixedPositiveNegative: Story = {
  render: DefaultRenderer,
  args: {
    ...commonArgs,
    data: [
      { date: '2023-01-01', value: 50 },
      { date: '2023-01-02', value: -20 },
      { date: '2023-01-03', value: 30 },
      { date: '2023-01-04', value: -10 },
      { date: '2023-01-05', value: 40 },
      { date: '2023-01-06', value: -30 },
    ],
  },
};

export const ZeroValues: Story = {
  render: DefaultRenderer,
  args: {
    ...commonArgs,
    data: [
      { date: '2023-01-01', value: 0 },
      { date: '2023-01-02', value: 0 },
      { date: '2023-01-03', value: 0 },
      { date: '2023-01-04', value: 0 },
      { date: '2023-01-05', value: 0 },
    ],
  },
};

export const VerySmallValues: Story = {
  render: DefaultRenderer,
  args: {
    ...commonArgs,
    data: [
      { date: '2023-01-01', value: 0.001 },
      { date: '2023-01-02', value: 0.003 },
      { date: '2023-01-03', value: 0.002 },
      { date: '2023-01-04', value: 0.0015 },
      { date: '2023-01-05', value: 0.0025 },
    ],
  },
};

export const VeryLargeValues: Story = {
  render: DefaultRenderer,
  args: {
    ...commonArgs,
    data: [
      { date: '2023-01-01', value: 1000000 },
      { date: '2023-01-02', value: 2500000 },
      { date: '2023-01-03', value: 1500000 },
      { date: '2023-01-04', value: 3000000 },
      { date: '2023-01-05', value: 2000000 },
    ],
  },
};
