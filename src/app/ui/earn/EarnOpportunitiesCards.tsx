import { motion, AnimatePresence } from 'framer-motion';
import { EarnCard } from 'src/components/Cards/EarnCard/EarnCard';
import { EarnCardVariant } from 'src/components/Cards/EarnCard/EarnCard.types';
import { AtLeastNWhenLoading } from 'src/utils/earn/utils';
import { DepositButtonDisplayMode } from 'src/components/composite/DepositButton/DepositButton.types';
import { DepositFlowButton } from 'src/components/composite/DepositFlow/DepositFlow';
import { GridContainer } from 'src/components/Containers/GridContainer';
import { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';
import { AppPaths } from 'src/const/urls';

export const EarnOpportunitiesCards = ({
  items,
  isLoading,
  variant,
}: {
  items: EarnOpportunityWithLatestAnalytics[];
  isLoading: boolean;
  variant: EarnCardVariant;
}) => {
  const isCompact = variant === 'compact';
  const gridItems = AtLeastNWhenLoading(items, isLoading, 3, Infinity);

  return (
    <GridContainer
      gridTemplateColumns={
        isCompact
          ? 'repeat(auto-fill, minmax(328px, 1fr))'
          : 'repeat(auto-fit, 100%)'
      }
      gap={3}
      justifyContent={isCompact ? 'space-evenly' : undefined}
    >
      <AnimatePresence mode="popLayout">
        {gridItems.map((item, index) => (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            key={item?.slug || index}
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
                      minFromAmountUSD: 5,
                      positionUrl: item.url ?? 'unset',
                      address: item.lpToken.address,
                    }}
                    displayMode={DepositButtonDisplayMode.IconOnly}
                    size={isCompact ? 'large' : 'medium'}
                    disabled
                  />
                }
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </GridContainer>
  );
};
