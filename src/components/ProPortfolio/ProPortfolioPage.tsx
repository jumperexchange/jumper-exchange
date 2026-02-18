import type { ProPortfolioData, PnLTimeframe } from '@/types/pro-portfolio';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import { PnLSummaryCard } from './PnLSummaryCard/PnLSummaryCard';
import { PnLChart } from './PnLChart/PnLChart';
import { PerformanceMetricsCard } from './PerformanceMetricsCard/PerformanceMetricsCard';
import { AccountInfoCard } from './AccountInfoCard/AccountInfoCard';
import { TimeframeSelector } from './TimeframeSelector/TimeframeSelector';

export interface ProPortfolioPageProps {
  data: ProPortfolioData | null;
  isLoading?: boolean;
  onTimeframeChange?: (timeframe: PnLTimeframe) => void;
}

const EmptyState = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        gap: 2,
      }}
    >
      <Typography variant="titleLarge" color="text.secondary">
        No Portfolio Data
      </Typography>
      <Typography variant="bodyMedium" color="text.secondary">
        Connect a wallet to view your portfolio performance.
      </Typography>
    </Box>
  );
};

const LoadingSkeleton = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
    <Skeleton variant="rounded" height={44} width={300} />
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' },
        gap: 3,
      }}
    >
      <Skeleton variant="rounded" height={280} />
      <Skeleton variant="rounded" height={380} />
    </Box>
    <Skeleton variant="rounded" height={140} />
    <Skeleton variant="rounded" height={300} />
  </Box>
);

export const ProPortfolioPage = ({
  data,
  isLoading,
  onTimeframeChange,
}: ProPortfolioPageProps) => {
  if (isLoading) {
    return (
      <Box sx={{ p: 3, maxWidth: 1200 }}>
        <LoadingSkeleton />
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ p: 3, maxWidth: 1200 }}>
        <EmptyState />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        maxWidth: 1200,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      {/* Header with timeframe */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="titleLarge">Pro Portfolio</Typography>
        <TimeframeSelector
          value={data.selectedTimeframe}
          onChange={(tf) => onTimeframeChange?.(tf)}
        />
      </Box>

      {/* PNL row: summary + chart */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '360px 1fr' },
          gap: 3,
        }}
      >
        <PnLSummaryCard summary={data.aggregatedPnL} />
        <PnLChart data={data.pnlHistory} />
      </Box>

      {/* Performance metrics (first account) */}
      {data.accounts[0] && (
        <PerformanceMetricsCard metrics={data.accounts[0].performance} />
      )}

      {/* Account cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="bodyLargeStrong" color="text.secondary">
          Connected Wallets ({data.accounts.length})
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              lg: data.accounts.length > 1 ? '1fr 1fr' : '1fr',
            },
            gap: 3,
          }}
        >
          {data.accounts.map((account) => (
            <AccountInfoCard key={account.address} account={account} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};
