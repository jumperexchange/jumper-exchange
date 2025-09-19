import useMediaQuery from '@mui/material/useMediaQuery';
import { uniqBy } from 'lodash';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from 'src/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';
import { EntityChainStack } from 'src/components/composite/EntityChainStack/EntityChainStack';
import { EntityChainStackVariant } from 'src/components/composite/EntityChainStack/EntityChainStack.types';
import { TokenStack } from 'src/components/composite/TokenStack/TokenStack';
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
import { formatLockupDuration } from './shared';

export const ListItemEarnCard: FC<Omit<EarnCardProps, 'variant'>> = ({
  data,
  primaryAction,
  isLoading,
  onClick,
}) => {
  // Note: later we might want to keep rendering the card if it's loading but already has data (on ttl for examples).
  const isEmpty = data === null || isLoading;
  const { t } = useTranslation();

  if (isEmpty) {
    return <ListItemEarnCardSkeleton />;
  }

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const { asset, protocol, forYou, tags, lockupMonths, latest, lpToken } = data;
  const { tvlUsd, apy } = latest;

  const assets = [asset];
  const chains = uniqBy(
    assets.map((asset) => asset.chain),
    'chainId',
  );

  const items = useMemo(() => {
    const result = [];

    if (apy) {
      const formatted = `${(apy.total * 100).toLocaleString()}%`;

      result.push(
        <ListItemTooltipBadge
          label={`${formatted} ${t('labels.apy')}`}
          title={t('tooltips.apy')}
          key={t('labels.apy')}
        />,
      );
    }

    const lockupMonthsNumber = Number(lockupMonths);
    if (!isNaN(lockupMonthsNumber)) {
      const formatted = formatLockupDuration(lockupMonthsNumber);
      result.push(
        <ListItemTooltipBadge
          title={t('tooltips.lockupPeriod', {
            formattedLockupPeriod: formatted,
          })}
          key={t('labels.lockupPeriod')}
          label={formatted}
        />,
      );
    }

    if (tvlUsd) {
      const formatted = `$${Number(tvlUsd).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`;

      result.push(
        <ListItemTooltipBadge
          title={t('tooltips.tvl')}
          key={t('labels.tvl')}
          label={`${formatted} ${t('labels.tvl')}`}
        />,
      );
    }

    result.push(
      <ListItemTooltipBadge
        title={t('tooltips.assets')}
        key={t('labels.assets')}
        startIcon={<TokenStack tokens={assets} />}
        label={assets.length === 1 ? assets[0].name : ''}
      />,
    );
    return result;
  }, [apy, lockupMonths, tvlUsd, assets]);

  return (
    <ListItemEarnCardContainer onClick={onClick}>
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
  );
};
