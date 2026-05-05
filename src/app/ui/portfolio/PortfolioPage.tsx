import { PortfolioAssetsSection } from './PortfolioAssetsSection';
import { PortfolioDustSection } from './PortfolioDustSection';
import { PortfolioHeaderSection } from './PortfolioHeaderSection';

export const PortfolioPage = () => {
  return (
    <>
      <PortfolioHeaderSection />
      <PortfolioDustSection />
      <PortfolioAssetsSection />
    </>
  );
};
