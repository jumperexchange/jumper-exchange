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
      {gridItems.map((item, index) =>
        item == null ? (
          <EarnCard
            key={index}
            variant={variant}
            isLoading={true}
            data={null}
          />
        ) : (
          <EarnCard
            key={item.slug}
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
                  address: item.lpToken.address,
                }}
                displayMode={DepositButtonDisplayMode.IconOnly}
                size={isCompact ? 'large' : 'medium'}
                disabled
              />
            }
          />
        ),
      )}
    </GridContainer>
  );
};
