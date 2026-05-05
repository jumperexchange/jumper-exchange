import useMediaQuery from '@mui/material/useMediaQuery';
import type { FC } from 'react';
import { Badge } from 'src/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';
import { AvatarSize } from 'src/components/core/AvatarStack/AvatarStack.types';
import { RecommendationIcon } from 'src/components/illustrations/RecommendationIcon';
import {
  ListItemEarnCardBody,
  ListItemEarnCardContainer,
  ListItemEarnCardTagContainer,
  ListItemEarnContentWrapper,
} from '../EarnCard.styles';
import type { EarnCardProps } from '../EarnCard.types';
import { ListItemEarnCardSkeleton } from './ListItemEarnCardSkeleton';
import { ListItemTooltipBadge } from './ListItemTooltipBadge';
import { useFormatDisplayEarnOpportunityData } from 'src/hooks/earn/useFormatDisplayEarnOpportunityData';
import { ConditionalLink } from 'src/components/Link/ConditionalLink';
import { ListItemEarnCardMissingPosition } from './ListItemEarnCardMissingPosition';
import { EntityStackWithBadge } from '@/components/composite/EntityStackWithBadge/EntityStackWithBadge';

export const ListItemEarnCard: FC<Omit<EarnCardProps, 'variant'>> = ({
  data,
  primaryAction,
  isLoading,
  isMissingPosition,
  href,
}) => {
  // Note: later we might want to keep rendering the card if it's loading but already has data (on ttl for examples).
  const isEmpty = data === null || isLoading;

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const { overviewItems, chains } = useFormatDisplayEarnOpportunityData(
    data,
    'list-item',
  );
  const { protocol, forYou, tags, lpToken, name } = data ?? {};
  const title = name || protocol?.product || protocol?.name;

  const items = overviewItems.map((item) => (
    <ListItemTooltipBadge
      dataTestId={item.dataTestId}
      key={item.key}
      label={
        item.key === 'apy' || item.key === 'tvl'
          ? `${item.value} ${item.label}`
          : item.value
      }
      title={item.tooltip}
      startIcon={item.valuePrepend}
    />
  ));

  if (isMissingPosition) {
    return <ListItemEarnCardMissingPosition />;
  }

  if (isEmpty) {
    return <ListItemEarnCardSkeleton />;
  }

  return (
    <ConditionalLink href={href}>
      <ListItemEarnCardContainer hasLink={!!href}>
        <ListItemEarnCardBody hasHintHoverActive>
          <ListItemEarnContentWrapper direction="row" sx={{ flexWrap: 'wrap' }}>
            <EntityStackWithBadge
              addressOverride={lpToken?.address}
              entities={[protocol!]}
              size={AvatarSize.XXL}
              badgeEntities={chains}
              badgeSize={AvatarSize.SM}
              content={{
                title,
              }}
            />
            {isMobile && primaryAction}
            <ListItemEarnCardTagContainer
              direction="row"
              sx={{ flexWrap: 'wrap' }}
            >
              {forYou && (
                <Badge
                  variant={BadgeVariant.Secondary}
                  size={BadgeSize.MD}
                  startIcon={<RecommendationIcon height={16} width={16} />}
                />
              )}
              {tags?.map((tag) => (
                <Badge
                  variant={BadgeVariant.Secondary}
                  size={BadgeSize.MD}
                  label={tag}
                  key={tag}
                />
              ))}
              {items}
              {!isMobile && primaryAction}
            </ListItemEarnCardTagContainer>
          </ListItemEarnContentWrapper>
        </ListItemEarnCardBody>
      </ListItemEarnCardContainer>
    </ConditionalLink>
  );
};
