import { PortfolioContentSection } from './PortfolioContentSection';
import { PortfolioDustSection } from './PortfolioDustSection';
import { PortfolioHeaderSection } from './PortfolioHeaderSection';

export const PortfolioPage = () => {
  return (
    <>
      <PortfolioHeaderSection />
      <PortfolioDustSection />
      <PortfolioContentSection />
    </>
  );
};
