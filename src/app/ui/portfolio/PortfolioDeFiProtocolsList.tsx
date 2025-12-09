import type { PropsWithChildren } from 'react';
import { DeFiPositionCard } from '@/components/composite/DeFiPositionCard/DeFiPositionCard';
import { DepositFlowModal } from '@/components/composite/DepositFlow/DepositFlow';
import { useFormatDisplayDeFiPositions } from '@/hooks/portfolio/useFormatDisplayDeFiPositions';
import { usePortfolioDeFiPositionsFiltering } from './PortfolioDeFiPositionsFilteringContext';
import { PortfolioEmptyList } from './PortfolioEmptyList';
import {
  PortfolioAssetContainer,
  PortfolioAssetsListContainer,
} from './PortfolioPage.styles';
import { WithdrawFlowModal } from '@/components/composite/WithdrawFlow/WithdrawFlow';
import { DeFiPositionCardSkeleton } from '@/components/composite/DeFiPositionCard/DeFiPositionCardSkeleton';
import { motion, AnimatePresence } from 'motion/react';
import { useContactSupportEvent } from '@/components/Widgets/events/hooks/useContactSupportEvent';

const AnimatedAssetItem = ({ children }: PropsWithChildren) => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.3 }}
  >
    <PortfolioAssetContainer>{children}</PortfolioAssetContainer>
  </motion.div>
);

export const PortfolioDeFiProtocolsList = () => {
  useContactSupportEvent();
  const { data, isAllDataEmpty, isLoading, clearFilters, sortBy, order } =
    usePortfolioDeFiPositionsFiltering();

  const protocolGroups = useFormatDisplayDeFiPositions(
    data,
    (position) => `${position.protocol.name}-${position.chain.chainId}`,
    { sortBy, order },
  );

  const renderContent = () => {
    if (isLoading) {
      return Array.from({ length: 3 }).map((_, index) => (
        <AnimatedAssetItem key={index}>
          <DeFiPositionCardSkeleton />
        </AnimatedAssetItem>
      ));
    }

    if (protocolGroups.length > 0) {
      return protocolGroups.map((positions) => (
        <AnimatedAssetItem
          key={`${positions[0].protocol.name}-${positions[0].chain.chainId}`}
        >
          <DeFiPositionCard defiPositions={positions} isLoading={isLoading} />
        </AnimatedAssetItem>
      ));
    }

    return (
      <AnimatedAssetItem>
        <PortfolioEmptyList onClearFilters={clearFilters} />
      </AnimatedAssetItem>
    );
  };

  if (isAllDataEmpty) {
    return null;
  }

  return (
    <>
      <PortfolioAssetsListContainer useFlexGap direction="column">
        <AnimatePresence mode="popLayout">{renderContent()}</AnimatePresence>
      </PortfolioAssetsListContainer>
      <DepositFlowModal />
      <WithdrawFlowModal />
    </>
  );
};
