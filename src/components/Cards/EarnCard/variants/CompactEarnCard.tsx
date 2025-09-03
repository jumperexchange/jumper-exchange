import { FC, useMemo } from 'react';
import { EarnCardProps } from '../EarnCard.types';
import { Badge } from 'src/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';
import {
  CompactEarnCardContentContainer,
  CompactEarnCardHeaderContainer,
  CompactEarnCardTagContainer,
  CompactEarnCardContainer,
} from '../EarnCard.styles';
import { RecommendationIcon } from 'src/components/illustrations/RecommendationIcon';
import { EntityChainStack } from 'src/components/composite/EntityChainStack/EntityChainStack';
import { EntityChainStackVariant } from 'src/components/composite/EntityChainStack/EntityChainStack.types';
import Grid from '@mui/material/Grid';
import { CompactEarnCardItem } from './CompactEarnCardItem';
import { TokenStack } from 'src/components/composite/TokenStack/TokenStack';
import { chunk } from 'lodash';
import { CompactEarnCardSkeleton } from './CompactEarnCardSkeleton';

export const CompactEarnCard: FC<Omit<EarnCardProps, 'variant'>> = ({
  primaryAction,
  assets,
  protocol,
  link,
  recommended,
  tags,
  lockupPeriod,
  apy,
  tvl,
  isLoading,
  onClick,
}) => {
  if (isLoading) {
    return <CompactEarnCardSkeleton />;
  }
  const gridItems = useMemo(() => {
    const insightItems = [];
    if (apy) {
      insightItems.push(
        <CompactEarnCardItem
          title={apy.label}
          value={apy.valueFormatted}
          tooltip={apy.tooltip}
        />,
      );
    }
    if (lockupPeriod) {
      insightItems.push(
        <CompactEarnCardItem
          title={lockupPeriod.label}
          value={lockupPeriod.valueFormatted}
          tooltip={lockupPeriod.tooltip}
        />,
      );
    }
    if (tvl) {
      insightItems.push(
        <CompactEarnCardItem
          title={tvl.label}
          value={tvl.valueFormatted}
          tooltip={tvl.tooltip}
        />,
      );
    }
    insightItems.push(
      <CompactEarnCardItem
        title={assets.label}
        valuePrepend={<TokenStack tokens={assets.tokens} />}
        value={assets.tokens.length === 1 ? assets.tokens[0].name : ''}
        tooltip={assets.tooltip}
      />,
    );
    return insightItems;
  }, [apy, lockupPeriod, tvl, assets]);

  return (
    <CompactEarnCardContainer onClick={onClick}>
      <CompactEarnCardHeaderContainer direction="row">
        <CompactEarnCardTagContainer direction="row">
          {recommended && (
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
          chains={assets.tokens.map((asset) => asset.chain)}
        />
        {chunk(gridItems, 2).map((insightItems, index) => (
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
            {insightItems}
          </Grid>
        ))}
      </CompactEarnCardContentContainer>
    </CompactEarnCardContainer>
  );
};
