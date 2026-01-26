import { motion, AnimatePresence } from 'motion/react';
import { EarnCard } from 'src/components/Cards/EarnCard/EarnCard';
import type { EarnCardVariant } from 'src/components/Cards/EarnCard/EarnCard.types';
import { DepositButtonDisplayMode } from 'src/components/composite/DepositButton/DepositButton.types';
import { DepositFlowButton } from 'src/components/composite/DepositFlow/DepositFlow';
import { GridContainer } from 'src/components/Containers/GridContainer';
import type { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';
import { AppPaths } from 'src/const/urls';
import { AtLeastNWhenLoading } from '@/utils/earn/utils';
import { useMemo } from 'react';

export const EarnOpportunitiesCards = ({
  items,
  isLoading,
  variant,
  showPlaceholderCard,
}: {
  items: EarnOpportunityWithLatestAnalytics[];
  isLoading: boolean;
  variant: EarnCardVariant;
  showPlaceholderCard: boolean;
}) => {
  const isCompact = variant === 'compact';
  const gridItems = useMemo(
    () => AtLeastNWhenLoading(items, isLoading, 3, Infinity),
    [items, isLoading],
  );

  return (
    <GridContainer
      gridTemplateColumns={
        isCompact
          ? 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))'
          : 'repeat(auto-fit, 100%)'
      }
      gap={3}
      justifyContent={isCompact ? 'space-evenly' : undefined}
      dataTestId="earn-opportunities-cards-grid"
    >
      <AnimatePresence mode="popLayout">
        {gridItems.map((item, index) => (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            key={`${item?.slug}-${index}`}
          >
            {item == null ? (
              <EarnCard variant={variant} isLoading={true} data={null} />
            ) : (
              <EarnCard
                href={`${AppPaths.Earn}/${item.slug}`}
                variant={variant}
                isLoading={false}
                data={item}
                primaryAction={
                  <DepositFlowButton
                    // TODO: Enable deposit flow button and properly set earnOpportunity
                    earnOpportunity={{
                      ...item,
                      minFromAmountUSD: 0.99,
                      positionUrl: item.url ?? 'unset',
                    }}
                    displayMode={DepositButtonDisplayMode.IconOnly}
                    size={isCompact ? 'large' : 'medium'}
                  />
                }
              />
            )}
          </motion.div>
        ))}
        {showPlaceholderCard && gridItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <EarnCard
              variant={variant}
              data={null}
              isLoading={false}
              isMissingPosition={true}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </GridContainer>
  );
};
