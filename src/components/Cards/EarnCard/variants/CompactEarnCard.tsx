import Grid from '@mui/material/Grid';
import { chunk } from 'lodash';
import { FC } from 'react';
import { Badge } from 'src/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';
import { EntityChainStack } from 'src/components/composite/EntityChainStack/EntityChainStack';
import { EntityChainStackVariant } from 'src/components/composite/EntityChainStack/EntityChainStack.types';
import { RecommendationIcon } from 'src/components/illustrations/RecommendationIcon';
import {
  CompactEarnCardContainer,
  CompactEarnCardContentContainer,
  CompactEarnCardHeaderContainer,
  CompactEarnCardTagContainer,
} from '../EarnCard.styles';
import { EarnCardProps } from '../EarnCard.types';
import { CompactEarnCardItem } from './CompactEarnCardItem';
import { CompactEarnCardSkeleton } from './CompactEarnCardSkeleton';
import { useFormatDisplayEarnOpportunityData } from 'src/hooks/earn/useFormatDisplayEarnOpportunityData';
import { ConditionalLink } from 'src/components/Link/ConditionalLink';

export const CompactEarnCard: FC<Omit<EarnCardProps, 'variant'>> = ({
  primaryAction,
  data,
  isLoading,
  href,
}) => {
  // Note: later we might want to keep rendering the card if it's loading but already has data (on ttl for examples).
  const isEmpty = !data || isLoading;

  const { overviewItems, chains } = useFormatDisplayEarnOpportunityData(
    data,
    'compact',
  );
  const { protocol, forYou, tags, lpToken } = data ?? {};

  const items = overviewItems.map((item, index) => {
    const shouldExpand =
      index === overviewItems.length - 1 && overviewItems.length % 2 !== 0;
    return (
      <CompactEarnCardItem
        key={item.key}
        dataTestId={item.dataTestId}
        title={item.label}
        value={item.value}
        valuePrepend={item.valuePrepend}
        tooltip={item.tooltip}
        shouldExpand={shouldExpand}
      />
    );
  });

  if (isEmpty) {
    return <CompactEarnCardSkeleton />;
  }

  return (
    <ConditionalLink href={href}>
      <CompactEarnCardContainer hasLink={!!href}>
        <CompactEarnCardHeaderContainer direction="row">
          <CompactEarnCardTagContainer direction="row">
            {forYou && (
              <Badge
                variant={BadgeVariant.Secondary}
                size={BadgeSize.SM}
                startIcon={<RecommendationIcon height={12} width={12} />}
              />
            )}
            {tags?.map((tag) => (
              <Badge
                variant={BadgeVariant.Secondary}
                size={BadgeSize.SM}
                label={tag}
                key={tag}
              />
            ))}
          </CompactEarnCardTagContainer>
          {primaryAction}
        </CompactEarnCardHeaderContainer>
        <CompactEarnCardContentContainer>
          <EntityChainStack
            variant={EntityChainStackVariant.Protocol}
            protocol={protocol}
            chains={chains}
          />
          {chunk(items, 2).map((itemsChunk, index) => (
            <Grid
              container
              rowSpacing={2}
              columnSpacing={2}
              key={index}
              sx={(theme) => ({
                backgroundColor: (theme.vars || theme).palette.alpha100.main,
                padding: theme.spacing(2),
                borderRadius: theme.spacing(2),
              })}
            >
              {itemsChunk}
            </Grid>
          ))}
        </CompactEarnCardContentContainer>
      </CompactEarnCardContainer>
    </ConditionalLink>
  );
};
