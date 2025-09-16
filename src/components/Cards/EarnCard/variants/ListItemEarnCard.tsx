import { FC, useMemo } from 'react';
import { EarnCardProps } from '../EarnCard.types';
import { EntityChainStack } from 'src/components/composite/EntityChainStack/EntityChainStack';
import { EntityChainStackVariant } from 'src/components/composite/EntityChainStack/EntityChainStack.types';
import { Badge } from 'src/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';
import { RecommendationIcon } from 'src/components/illustrations/RecommendationIcon';
import { Tooltip } from 'src/components/TooltipInfo/TooltipInfo.style';
import { TokenStack } from 'src/components/composite/TokenStack/TokenStack';
import {
  ListItemEarnContentWrapper,
  ListItemEarnCardTagContainer,
  ListItemEarnCardContainer,
} from '../EarnCard.styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ListItemEarnCardSkeleton } from './ListItemEarnCardSkeleton';
import { AvatarSize } from 'src/components/core/AvatarStack/AvatarStack.types';
import { ListItemTooltipBadge } from './ListItemTooltipBadge';

export const ListItemEarnCard: FC<Omit<EarnCardProps, 'variant'>> = ({
  apy,
  tvl,
  lockupPeriod,
  assets,
  protocol,
  recommended,
  tags,
  primaryAction,
  isLoading,
  onClick,
}) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  if (isLoading) {
    return <ListItemEarnCardSkeleton />;
  }

  const insightItems = useMemo(() => {
    const items = [];
    if (apy) {
      items.push(
        <ListItemTooltipBadge
          label={`${apy.valueFormatted} ${apy.label}`}
          title={apy.tooltip}
          key={apy.label}
        />,
      );
    }
    if (lockupPeriod) {
      items.push(
        <ListItemTooltipBadge
          title={lockupPeriod.tooltip}
          key={lockupPeriod.label}
          label={`${lockupPeriod.valueFormatted}`}
        />,
      );
    }
    if (tvl) {
      items.push(
        <ListItemTooltipBadge
          title={tvl.tooltip}
          key={tvl.label}
          label={`${tvl.valueFormatted} ${tvl.label}`}
        />,
      );
    }
    items.push(
      <ListItemTooltipBadge
        title={assets.tooltip}
        key={assets.label}
        startIcon={<TokenStack tokens={assets.tokens} />}
        label={assets.tokens.length === 1 ? assets.tokens[0].name : ''}
      />,
    );
    return items;
  }, [apy, lockupPeriod, tvl, assets]);

  return (
    <ListItemEarnCardContainer onClick={onClick}>
      <ListItemEarnContentWrapper direction="row" flexWrap="wrap">
        <EntityChainStack
          variant={EntityChainStackVariant.Protocol}
          protocol={protocol}
          chains={assets.tokens.map((asset) => asset.chain)}
          protocolSize={AvatarSize.XXL}
          chainsSize={AvatarSize.SM}
        />
        {isMobile && primaryAction}
        <ListItemEarnCardTagContainer direction="row" flexWrap="wrap">
          {recommended && (
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
          {insightItems}
          {!isMobile && primaryAction}
        </ListItemEarnCardTagContainer>
      </ListItemEarnContentWrapper>
    </ListItemEarnCardContainer>
  );
};
