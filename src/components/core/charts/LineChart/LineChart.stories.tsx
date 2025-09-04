import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { LineChart } from './LineChart';
import { LineChartSkeleton } from './LineChartSkeleton';
import Box from '@mui/material/Box';

const data = [
  {
    id: 'tvl',
    data: [
      { x: '2023-01-01', y: 97.92 },
      { x: '2023-01-02', y: 124.45 },
      { x: '2023-01-03', y: 86.26 },
      { x: '2023-01-04', y: 97.28 },
      { x: '2023-01-05', y: 91.52 },
      { x: '2023-02-06', y: 100.71 },
      { x: '2023-01-07', y: 130.35 },
      { x: '2023-01-08', y: 83.77 },
      { x: '2023-01-09', y: 103.57 },
      { x: '2023-01-10', y: 102.31 },
      { x: '2023-01-11', y: 119.63 },
      { x: '2023-01-12', y: 100.87 },
      { x: '2023-01-13', y: 88.29 },
      { x: '2023-03-14', y: 96.55 },
      { x: '2023-01-15', y: 103.58 },
      { x: '2023-01-16', y: 87.97 },
      { x: '2023-01-17', y: 90.75 },
      { x: '2023-01-18', y: 111.31 },
      { x: '2023-04-19', y: 137.6 },
      { x: '2023-01-20', y: 108.49 },
      { x: '2023-01-21', y: 105.54 },
      { x: '2023-01-22', y: 85.69 },
      { x: '2023-01-23', y: 108.31 },
      { x: '2023-01-24', y: 90.05 },
      { x: '2023-01-25', y: 105.59 },
    ],
  },
];

const commonArgs = {
  data,
  lineColor: '#8700B8',
  areaColor: '#F2D9F6',
  pointColor: '#31007A',
};

const meta = {
  component: LineChart,
  title: 'Core/Charts/LineChart',
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Box sx={{ height: 400 }}>
      <LineChart {...args} />
    </Box>
  ),
  args: {
    ...commonArgs,
  },
};

export const WithCustomLayers: Story = {
  render: (args) => (
    <Box sx={{ height: 400 }}>
      <LineChart {...args} />
    </Box>
  ),
  args: {
    ...commonArgs,
    enableCrosshair: true,
    enableGridY: true,
    enableXAxis: true,
    enableYAxis: true,
    dateFormat: 'MMM yyyy',
  },
};

export const CustomColors: Story = {
  render: (args) => (
    <Box sx={{ height: 400 }}>
      <LineChart {...args} />
    </Box>
  ),
  args: {
    ...commonArgs,
    lineColor: '#FF8C42',
    areaColor: '#FFF2E6',
    pointColor: '#E65100',
  },
};

export const DailyTVL: Story = {
  render: (args) => (
    <Box sx={{ height: 400 }}>
      <LineChart {...args} />
    </Box>
  ),
  args: {
    ...commonArgs,
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
    enableYAxis: true,
    enableXAxis: true,
    dateFormat: 'MMM d',
  },
};

export const Skeleton: Story = {
  render: (args) => (
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
