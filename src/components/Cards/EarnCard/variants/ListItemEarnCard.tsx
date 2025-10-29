import useMediaQuery from '@mui/material/useMediaQuery';
import { FC } from 'react';
import { Badge } from 'src/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';
import { EntityChainStack } from 'src/components/composite/EntityChainStack/EntityChainStack';
import { EntityChainStackVariant } from 'src/components/composite/EntityChainStack/EntityChainStack.types';
import { AvatarSize } from 'src/components/core/AvatarStack/AvatarStack.types';
import { RecommendationIcon } from 'src/components/illustrations/RecommendationIcon';
import {
  ListItemEarnCardContainer,
  ListItemEarnCardTagContainer,
  ListItemEarnContentWrapper,
} from '../EarnCard.styles';
import { EarnCardProps } from '../EarnCard.types';
import { ListItemEarnCardSkeleton } from './ListItemEarnCardSkeleton';
import { ListItemTooltipBadge } from './ListItemTooltipBadge';
import { useFormatDisplayEarnOpportunityData } from 'src/hooks/earn/useFormatDisplayEarnOpportunityData';
import { ConditionalLink } from 'src/components/Link/ConditionalLink';

export const ListItemEarnCard: FC<Omit<EarnCardProps, 'variant'>> = ({
  data,
  primaryAction,
  isLoading,
  href,
}) => {
  // Note: later we might want to keep rendering the card if it's loading but already has data (on ttl for examples).
  const isEmpty = data === null || isLoading;

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const { overviewItems, chains } = useFormatDisplayEarnOpportunityData(
    data,
    'list-item',
  );
  const { protocol, forYou, tags, lpToken } = data ?? {};

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

  if (isEmpty) {
    return <ListItemEarnCardSkeleton />;
  }

  return (
    <ConditionalLink href={href}>
      <ListItemEarnCardContainer hasLink={!!href}>
        <ListItemEarnContentWrapper direction="row" flexWrap="wrap">
          <EntityChainStack
            variant={EntityChainStackVariant.Protocol}
            protocol={protocol}
            chains={chains}
            protocolSize={AvatarSize.XXL}
            chainsSize={AvatarSize.SM}
          />
          {isMobile && primaryAction}
          <ListItemEarnCardTagContainer direction="row" flexWrap="wrap">
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
      </ListItemEarnCardContainer>
    </ConditionalLink>
  );
};
