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
  const gridItems = AtLeastNWhenLoading(items, isLoading, 3, Infinity);

  return (
    <GridContainer
      gridTemplateColumns={
        variant === 'compact'
          ? 'repeat(auto-fit, minmax(328px, 1fr))'
          : 'repeat(auto-fit, 1fr)'
      }
      gap={3}
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
                  minFromAmountUSD: 5,
                  positionUrl: item.url ?? 'unset',
                  address: item.lpToken.address,
                }}
                displayMode={DepositButtonDisplayMode.IconOnly}
                size={variant === 'compact' ? 'large' : 'medium'}
                disabled
              />
            }
          />
        ),
      )}
    </GridContainer>
  );
};
