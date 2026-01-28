import { notFound } from 'next/navigation';
import { PortfolioProvider } from '@/providers/PortfolioProvider/PortfolioProvider';
import { BalancesFilteringProvider } from '@/providers/PortfolioProvider/filtering/BalancesFilteringContext';
import { PositionsFilteringProvider } from '@/providers/PortfolioProvider/filtering/PositionsFilteringContext';
import { isProduction } from '@/utils/isProduction';
import { PortfolioPage } from '@/providers/PortfolioProvider/components/portfolio/PortfolioPage';

export default function Page() {
  if (isProduction) {
    return notFound();
  }

  return (
    <PortfolioProvider>
      <BalancesFilteringProvider>
        <PositionsFilteringProvider>
          <PortfolioPage />
        </PositionsFilteringProvider>
      </BalancesFilteringProvider>
    </PortfolioProvider>
  );
}
