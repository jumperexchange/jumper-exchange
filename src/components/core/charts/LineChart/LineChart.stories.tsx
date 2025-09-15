import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { LineChart, LineChartProps } from './LineChart';
import { LineChartSkeleton } from './LineChartSkeleton';
import Box from '@mui/material/Box';
import { useColorScheme, useTheme } from '@mui/material/styles';
import { LineSeries } from '@nivo/line';

const data = [
  {
    id: 'tvl',
    data: [
      { x: '2023-01-01', y: 97.92 },
      { x: '2023-01-02', y: 124.45 },
      { x: '2023-01-03', y: 86.26 },
      { x: '2023-01-04', y: 97.28 },
      { x: '2023-01-05', y: 91.52 },
      { x: '2023-01-07', y: 130.35 },
      { x: '2023-01-08', y: 83.77 },
      { x: '2023-01-09', y: 103.57 },
      { x: '2023-01-10', y: 102.31 },
      { x: '2023-01-11', y: 119.63 },
      { x: '2023-01-12', y: 100.87 },
      { x: '2023-01-13', y: 88.29 },
      { x: '2023-01-15', y: 103.58 },
      { x: '2023-01-16', y: 87.97 },
      { x: '2023-01-17', y: 90.75 },
      { x: '2023-01-18', y: 111.31 },
      { x: '2023-01-20', y: 108.49 },
      { x: '2023-01-21', y: 105.54 },
      { x: '2023-01-22', y: 85.69 },
      { x: '2023-01-23', y: 108.31 },
      { x: '2023-01-24', y: 90.05 },
      { x: '2023-01-25', y: 105.59 },
      { x: '2023-02-06', y: 100.71 },
      { x: '2023-03-14', y: 96.55 },
      { x: '2023-04-19', y: 137.6 },
    ],
  },
];

const commonArgs = {
  data,
  theme: {},
  dateFormat: 'dd MMM yyyy',
};

const allLayersEnabledArgs = {
  enableCrosshair: true,
  enableGridY: true,
  enableXAxis: true,
  enableYAxis: true,
  enableTooltip: true,
};

const meta = {
  component: LineChart,
  title: 'Core/Charts/LineChart',
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultRenderer = <T extends LineSeries>(args: LineChartProps<T>) => {
  const theme = useTheme();
  const { mode } = useColorScheme();
  const isLightTheme = mode === 'light';
  return (
    <Box sx={{ height: 400 }}>
      <LineChart
        {...args}
        theme={{
          topAreaColor: isLightTheme ? `#F2D9F6` : theme.palette.primary.main,
          bottomAreaColor: isLightTheme
            ? theme.palette.white.main
            : theme.palette.alpha200.main,
          pointColor: theme.palette.accent1.main,
          lineColor: theme.palette.accent2.main,
          ...args.theme,
        }}
      />
    </Box>
  );
};

export const Default: Story = {
  render: DefaultRenderer,
  args: {
    ...commonArgs,
  },
};

export const WithAllLayersEnabled: Story = {
  render: DefaultRenderer,
  args: {
    ...commonArgs,
    ...allLayersEnabledArgs,
  },
};

export const MonthlyTVL: Story = {
  render: DefaultRenderer,
  args: {
    ...commonArgs,
    ...allLayersEnabledArgs,
    data: [
      {
        id: 'tvl',
        data: [
          { x: '2023-01-01', y: 47 },
          { x: '2023-02-01', y: 120 },
          { x: '2023-03-01', y: 86 },
          { x: '2023-04-01', y: 97 },
          { x: '2023-05-01', y: 91 },
          { x: '2023-06-01', y: 130 },
        ],
      },
    ],
    dateFormat: 'MMM yyyy',
  },
};

export const DailyTVL: Story = {
  render: DefaultRenderer,
  args: {
    ...commonArgs,
    ...allLayersEnabledArgs,
    data: [
      {
        id: 'tvl',
        data: [
          { x: '2023-01-01', y: 100 },
          { x: '2023-01-02', y: 230 },
          { x: '2023-01-03', y: 120 },
          { x: '2023-01-04', y: 150 },
          { x: '2023-01-05', y: 100 },
          { x: '2023-01-06', y: 67 },
        ],
      },
    ],
  },
};

export const CustomColors: Story = {
  render: DefaultRenderer,
  args: {
    ...commonArgs,
    theme: {
      lineColor: '#FF8C42',
      topAreaColor: '#FFF2E6',
      pointColor: '#E65100',
    },
  },
};

export const Skeleton: Story = {
  render: () => (
    <Box
      sx={{
        height: 400,
      }}
    >
      <LineChartSkeleton height={400} />
    </Box>
  ),
  args: {
    ...commonArgs,
  },
};
