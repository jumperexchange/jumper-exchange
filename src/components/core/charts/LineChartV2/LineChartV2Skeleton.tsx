import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import { CHART_CONFIG } from './constants';
import { LineChartV2 } from './LineChartV2';

export interface LineChartV2SkeletonProps {
  height?: number;
  width?: number | string;
  enableXAxis?: boolean;
  enableYAxis?: boolean;
  enableGridY?: boolean;
  enableCrosshair?: boolean;
  enableTooltip?: boolean;
}

export const LineChartV2Skeleton = ({
  height = CHART_CONFIG.HEIGHT,
  width = '100%',
}: LineChartV2SkeletonProps) => {
  const theme = useTheme();

  // Mock data for skeleton
  const mockData = [
    { time: '2025-01-01', value: 15 },
    { time: '2025-01-02', value: 30 },
    { time: '2025-01-03', value: 25 },
    { time: '2025-01-04', value: 40 },
    { time: '2025-01-05', value: 60 },
    { time: '2025-01-06', value: 45 },
    { time: '2025-01-07', value: 40 },
    { time: '2025-01-08', value: 50 },
    { time: '2025-01-09', value: 40 },
    { time: '2025-01-10', value: 70 },
    { time: '2025-01-11', value: 70 },
    { time: '2025-01-12', value: 70 },
    { time: '2025-01-13', value: 55 },
  ];

  return (
    <Box
      sx={{
        height,
        width,
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(90deg, 
          transparent 0%, 
          ${(theme.vars || theme).palette.surface1.main} 50%, 
          transparent 100%
        )`,
        backgroundSize: '200% 100%',
        animation: 'shimmer 2s ease-in-out infinite',
        '@keyframes shimmer': {
          '0%': {
            backgroundPosition: '-200% 0',
          },
          '100%': {
            backgroundPosition: '200% 0',
          },
        },
      }}
    >
      <LineChartV2
        data={mockData}
        theme={{
          backgroundColor: 'transparent',
          lineColor: 'transparent',
          areaTopColor: '#F9F5FF',
          areaBottomColor: '#F9F5FF',
          pointColor: 'transparent',
        }}
      />
    </Box>
  );
};
