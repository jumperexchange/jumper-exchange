import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

export const LineChartSkeleton = () => {
  const muiTheme = useTheme();

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
    { time: '2025-01-11', value: 68 },
    { time: '2025-01-12', value: 70 },
    { time: '2025-01-13', value: 55 },
  ];
  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={mockData}>
          <defs>
            <mask id="areaMask">
              <Area
                type="natural"
                dataKey="value"
                baseValue={-1}
                fillOpacity={1}
                fill={(muiTheme.vars || muiTheme).palette.surface2.main}
              />
            </mask>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          mask: 'url(#areaMask)',
          WebkitMask: 'url(#areaMask)',
        }}
      >
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
          sx={{
            transform: 'none',
            borderRadius: 0,
            backgroundColor: (muiTheme.vars || muiTheme).palette.surface2.main,
          }}
        />
      </Box>
    </Box>
  );
};
