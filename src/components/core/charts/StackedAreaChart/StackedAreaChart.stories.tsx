import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { useRewardChartTheme } from '@/components/EarnDetails/hooks';
import Box from '@mui/material/Box';
import {
  StackedAreaChart,
  StackedAreaChartProps,
  StackedChartDataPoint,
} from './StackedAreaChart';

const stackedApyData: StackedChartDataPoint[] = [
  { date: '2023-01-01', base: 3.5, reward: 1.2, intrinsic: 0, total: 4.7 },
  { date: '2023-01-02', base: 3.8, reward: 1.5, intrinsic: 0, total: 5.3 },
  { date: '2023-01-03', base: 3.2, reward: 1.8, intrinsic: 0, total: 5.0 },
  { date: '2023-01-04', base: 3.6, reward: 2.1, intrinsic: 0, total: 5.7 },
  { date: '2023-01-05', base: 3.4, reward: 1.9, intrinsic: 0, total: 5.3 },
  { date: '2023-01-07', base: 4.0, reward: 2.3, intrinsic: 0, total: 6.3 },
  { date: '2023-01-08', base: 3.3, reward: 1.7, intrinsic: 0, total: 5.0 },
  { date: '2023-01-09', base: 3.7, reward: 2.0, intrinsic: 0, total: 5.7 },
  { date: '2023-01-10', base: 3.5, reward: 1.8, intrinsic: 0, total: 5.3 },
  { date: '2023-01-11', base: 3.9, reward: 2.2, intrinsic: 0, total: 6.1 },
  { date: '2023-01-12', base: 3.6, reward: 1.6, intrinsic: 0, total: 5.2 },
  { date: '2023-01-13', base: 3.4, reward: 1.4, intrinsic: 0, total: 4.8 },
  { date: '2023-01-15', base: 3.7, reward: 1.9, intrinsic: 0, total: 5.6 },
  { date: '2023-01-16', base: 3.2, reward: 1.5, intrinsic: 0, total: 4.7 },
  { date: '2023-01-17', base: 3.5, reward: 1.7, intrinsic: 0, total: 5.2 },
  { date: '2023-01-18', base: 4.1, reward: 2.4, intrinsic: 0, total: 6.5 },
  { date: '2023-01-20', base: 3.8, reward: 2.1, intrinsic: 0, total: 5.9 },
  { date: '2023-01-21', base: 3.6, reward: 1.8, intrinsic: 0, total: 5.4 },
  { date: '2023-01-22', base: 3.3, reward: 1.5, intrinsic: 0, total: 4.8 },
  { date: '2023-01-23', base: 3.9, reward: 2.0, intrinsic: 0, total: 5.9 },
];

const meta = {
  component: StackedAreaChart,
  title: 'Core/Charts/StackedAreaChart',
} satisfies Meta<typeof StackedAreaChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultRenderer = (args: StackedAreaChartProps) => {
  const theme = useRewardChartTheme();

  return (
    <Box sx={{ height: 400 }}>
      <StackedAreaChart {...args} theme={{ ...theme, ...args.theme }} />
    </Box>
  );
};

const commonArgs = {
  data: stackedApyData,
  theme: {},
  dateFormat: 'dd MMM',
};

export const Default: Story = {
  render: DefaultRenderer,
  args: {
    ...commonArgs,
  },
};

export const RewardOnly: Story = {
  render: DefaultRenderer,
  args: {
    ...commonArgs,
    data: stackedApyData.map((d) => ({ ...d, base: 0, total: d.reward })),
  },
};

export const BaseOnly: Story = {
  render: DefaultRenderer,
  args: {
    ...commonArgs,
    data: stackedApyData.map((d) => ({ ...d, reward: 0, total: d.base })),
  },
};

export const HighRewards: Story = {
  render: DefaultRenderer,
  args: {
    ...commonArgs,
    data: stackedApyData.map((d) => ({
      ...d,
      reward: d.reward! * 3,
      total: d.base! + d.reward! * 3,
    })),
  },
};

export const VerySmallValues: Story = {
  render: DefaultRenderer,
  args: {
    ...commonArgs,
    data: stackedApyData.map((d) => ({
      ...d,
      base: d.base! * 0.01,
      reward: d.reward! * 0.01,
      total: (d.base! + d.reward!) * 0.01,
    })),
  },
};

export const MonthlyView: Story = {
  render: DefaultRenderer,
  args: {
    ...commonArgs,
    dateFormat: 'MMM yyyy',
    data: [
      { date: '2025-01-01', base: 3.2, reward: 1.5, intrinsic: 0, total: 4.7 },
      { date: '2025-02-01', base: 3.5, reward: 1.8, intrinsic: 0, total: 5.3 },
      { date: '2025-03-01', base: 3.8, reward: 2.1, intrinsic: 0, total: 5.9 },
      { date: '2025-04-01', base: 3.4, reward: 1.9, intrinsic: 0, total: 5.3 },
      { date: '2025-05-01', base: 3.6, reward: 2.0, intrinsic: 0, total: 5.6 },
      { date: '2025-06-01', base: 3.9, reward: 2.3, intrinsic: 0, total: 6.2 },
      { date: '2025-07-01', base: 4.1, reward: 2.5, intrinsic: 0, total: 6.6 },
      { date: '2025-08-01', base: 3.7, reward: 2.2, intrinsic: 0, total: 5.9 },
      { date: '2025-09-01', base: 3.5, reward: 2.0, intrinsic: 0, total: 5.5 },
      { date: '2025-10-01', base: 3.8, reward: 2.4, intrinsic: 0, total: 6.2 },
      { date: '2025-11-01', base: 4.0, reward: 2.6, intrinsic: 0, total: 6.6 },
      { date: '2025-12-01', base: 4.2, reward: 2.8, intrinsic: 0, total: 7.0 },
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

export const ZeroValues: Story = {
  render: DefaultRenderer,
  args: {
    ...commonArgs,
    data: [
      { date: '2023-01-01', base: 0, reward: 0, intrinsic: 0, total: 0 },
      { date: '2023-01-02', base: 0, reward: 0, intrinsic: 0, total: 0 },
      { date: '2023-01-03', base: 0, reward: 0, intrinsic: 0, total: 0 },
      { date: '2023-01-04', base: 0, reward: 0, intrinsic: 0, total: 0 },
      { date: '2023-01-05', base: 0, reward: 0, intrinsic: 0, total: 0 },
    ],
  },
};
