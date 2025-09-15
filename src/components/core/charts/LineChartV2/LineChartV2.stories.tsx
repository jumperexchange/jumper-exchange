import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { LineChartV2, LineChartV2Props } from './LineChartV2';
import Box from '@mui/material/Box';
import { useColorScheme, useTheme } from '@mui/material/styles';
import { LineData, Time } from 'lightweight-charts';

const initialData = [
  { time: '2025-09-05', value: 32.51 },
  { time: '2025-09-06', value: 31.11 },
  { time: '2025-09-07', value: 27.02 },
  { time: '2025-09-08', value: 27.32 },
  { time: '2025-09-09', value: 25.17 },
  { time: '2025-09-10', value: 28.89 },
  { time: '2025-09-11', value: 25.46 },
  { time: '2025-09-12', value: 23.92 },
  { time: '2025-09-13', value: 22.68 },
  { time: '2025-09-14', value: 22.67 },
  { time: '2025-09-15', value: 23.92 },
  { time: '2025-09-16', value: 22.68 },
  { time: '2025-09-17', value: 22.67 },
  { time: '2025-09-18', value: 28.67 },
];

const commonArgs = {
  data: initialData,
  dataSetId: 'tvl',
  dateFormat: 'dd MMM yyyy',
  enableCrosshair: true,
  enableGridY: true,
  enableXAxis: true,
  enableYAxis: true,
  enableTooltip: true,
  theme: {},
};

const meta = {
  component: LineChartV2,
  title: 'Core/Charts/LineChartV2',
} satisfies Meta<typeof LineChartV2>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultRenderer = <T extends LineData<Time>>(
  args: LineChartV2Props<T>,
) => {
  const theme = useTheme();
  const { mode } = useColorScheme();
  const isLightTheme = mode === 'light';
  return (
    <Box sx={{ height: 400 }}>
      <LineChartV2
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

export const MonthlyTVL: Story = {
  render: DefaultRenderer,
  args: {
    ...commonArgs,
    dateFormat: 'MMM yyyy',
    data: [
      { time: '2025-09-01', value: 32.51 },
      { time: '2025-10-01', value: 31.11 },
      { time: '2025-11-01', value: 27.02 },
      { time: '2025-12-01', value: 27.32 },
      { time: '2026-01-01', value: 25.17 },
      { time: '2026-02-01', value: 28.89 },
      { time: '2026-03-01', value: 25.46 },
      { time: '2026-04-01', value: 23.92 },
      { time: '2026-05-01', value: 22.68 },
      { time: '2026-06-01', value: 22.67 },
      { time: '2026-07-01', value: 23.92 },
      { time: '2026-08-01', value: 22.68 },
      { time: '2026-09-01', value: 22.67 },
      { time: '2026-10-01', value: 28.67 },
    ],
  },
};

export const Skeleton: Story = {
  render: DefaultRenderer,
  args: {
    ...commonArgs,
    isLoading: true,
  },
};
