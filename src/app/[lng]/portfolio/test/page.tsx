/**
 * @deprecated use the PortfolioPage component instead
 */
import { PortfolioTestPage } from '@/app/ui/portfolio/PortfolioTestPage';
import { notFound } from 'next/navigation';
import { isProduction } from '@/utils/isProduction';

export default function Page() {
  if (isProduction) {
    return notFound();
  }
  return <PortfolioTestPage />;
}
