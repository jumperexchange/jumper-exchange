'use client';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { useId } from 'react';
import { useTheme } from '@mui/material/styles';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

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

export const LineChartSkeletonClient = () => {
  const muiTheme = useTheme();
  const maskId = useId().replace(/:/g, '');

  return (
    <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
      <ResponsiveContainer
        width="100%"
        height="100%"
        initialDimension={{ height: 234, width: 250 }}
      >
        <AreaChart data={mockData}>
          <defs>
            <mask id={maskId}>
              <Area
                type="natural"
                stroke="none"
                dataKey="value"
                baseValue={-1}
                fillOpacity={1}
                fill={(muiTheme.vars || muiTheme).palette.surface2.main}
                isAnimationActive={false}
              />
            </mask>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          mask: `url(#${maskId})`,
          WebkitMask: `url(#${maskId})`,
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
