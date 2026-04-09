import Grid from '@mui/material/Grid';
import { chunk } from 'lodash';
import type { FC } from 'react';
import { Badge } from 'src/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';
import { RecommendationIcon } from 'src/components/illustrations/RecommendationIcon';
import {
  CompactEarnCardBody,
  CompactEarnCardContainer,
  CompactEarnCardContentContainer,
  CompactEarnCardHeaderContainer,
  CompactEarnCardTagContainer,
} from '../EarnCard.styles';
import type { EarnCardProps } from '../EarnCard.types';
import { CompactEarnCardItem } from './CompactEarnCardItem';
import { CompactEarnCardSkeleton } from './CompactEarnCardSkeleton';
import { useFormatDisplayEarnOpportunityData } from 'src/hooks/earn/useFormatDisplayEarnOpportunityData';
import { ConditionalLink } from 'src/components/Link/ConditionalLink';
import { CompactEarnCardMissingPosition } from './CompactEarnCardMissingPosition';
import { EntityStackWithBadge } from '@/components/composite/EntityStackWithBadge/EntityStackWithBadge';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';

export const CompactEarnCard: FC<Omit<EarnCardProps, 'variant'>> = ({
  primaryAction,
  data,
  isLoading,
  isMissingPosition,
  href,
}) => {
  // Note: later we might want to keep rendering the card if it's loading but already has data (on ttl for examples).
  const isEmpty = !data || isLoading;

  const { overviewItems, chains } = useFormatDisplayEarnOpportunityData(
    data,
    'compact',
  );
  const { protocol, forYou, tags, lpToken, name } = data ?? {};

  const title = name || protocol?.product || protocol?.name;

  const items = overviewItems.map((item, index) => {
    const shouldExpand =
      overviewItems.length === 2 ||
      (index === overviewItems.length - 1 && overviewItems.length % 2 !== 0);

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

  if (isMissingPosition) {
    return <CompactEarnCardMissingPosition />;
  }

  if (isEmpty) {
    return <CompactEarnCardSkeleton />;
  }

  return (
    <ConditionalLink href={href}>
      <CompactEarnCardContainer hasLink={!!href}>
        <CompactEarnCardBody hasHintHoverActive>
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
                  data-testid={`earn-card-tag-${tag.toLowerCase().replace(/\s+/g, '-')}`}
                />
              ))}
            </CompactEarnCardTagContainer>
            {primaryAction}
          </CompactEarnCardHeaderContainer>
          <CompactEarnCardContentContainer>
            <EntityStackWithBadge
              addressOverride={lpToken?.address}
              entities={[protocol!]}
              size={AvatarSize.XL}
              badgeEntities={chains}
              content={{
                title,
              }}
            />
            {chunk(items, items.length > 2 ? 2 : 1).map((itemsChunk, index) => (
              <Grid container rowSpacing={2} columnSpacing={2} key={index}>
                {itemsChunk}
              </Grid>
            ))}
          </CompactEarnCardContentContainer>
        </CompactEarnCardBody>
      </CompactEarnCardContainer>
    </ConditionalLink>
  );
};
