import { notFound } from 'next/navigation';
import { PortfolioTestPage } from '@/app/ui/portfolio/PortfolioTestPage';
import { PortfolioProvider } from '@/providers/PortfolioProvider/PortfolioProvider';
import { BalancesFilteringProvider } from '@/providers/PortfolioProvider/filtering/BalancesFilteringContext';
import { PositionsFilteringProvider } from '@/providers/PortfolioProvider/filtering/PositionsFilteringContext';
import { isProduction } from '@/utils/isProduction';

export default function Page() {
  if (isProduction) {
    return notFound();
  }

  return (
    <PortfolioProvider>
      <BalancesFilteringProvider>
        <PositionsFilteringProvider>
          <PortfolioTestPage />
        </PositionsFilteringProvider>
      </BalancesFilteringProvider>
    </PortfolioProvider>
  );
}
