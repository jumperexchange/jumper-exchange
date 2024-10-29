import { Stack } from '@mui/material';
import PortfolioTokenSkeleton from '@/components/Portfolio/PortfolioTokensSkeleton';
import TotalBalanceSkeleton from '@/components/Portfolio/TotalBalance.Skeleton';

function PortfolioSkeleton() {
  return (
    <>
      <TotalBalanceSkeleton />
      <Stack spacing={1}>
        <PortfolioTokenSkeleton />
      </Stack>
    </>
  );
}

export default PortfolioSkeleton;
