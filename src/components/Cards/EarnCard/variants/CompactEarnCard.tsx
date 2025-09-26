import Grid from '@mui/material/Grid';
import { chunk, uniqBy } from 'lodash';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from 'src/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';
import { EntityChainStack } from 'src/components/composite/EntityChainStack/EntityChainStack';
import { EntityChainStackVariant } from 'src/components/composite/EntityChainStack/EntityChainStack.types';
import { TokenStack } from 'src/components/composite/TokenStack/TokenStack';
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
import { formatLockupDuration } from './shared';

export const CompactEarnCard: FC<Omit<EarnCardProps, 'variant'>> = ({
  primaryAction,
  data,
  isLoading,
  onClick,
}) => {
  // Note: later we might want to keep rendering the card if it's loading but already has data (on ttl for examples).
  const isEmpty = data === null || isLoading;
  const { t } = useTranslation();

  if (isEmpty) {
    return <CompactEarnCardSkeleton />;
  }

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
        <CompactEarnCardItem
          title={t('labels.apy')}
          value={formatted}
          tooltip={t('tooltips.apy')}
        />,
      );
    }

    const lockupMonthsNumber = Number(lockupMonths);
    if (!isNaN(lockupMonthsNumber)) {
      result.push(
        <CompactEarnCardItem
          title={t('labels.lockupPeriod')}
          value={formatLockupDuration(lockupMonthsNumber)}
          tooltip={t('tooltips.lockupPeriod', {
            formattedLockupPeriod: formatLockupDuration(lockupMonthsNumber),
          })}
        />,
      );
    }

    if (tvlUsd) {
      const formatted = `$${Number(tvlUsd).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`;

      result.push(
        <CompactEarnCardItem
          title={t('labels.tvl')}
          value={formatted}
          tooltip={t('tooltips.tvl')}
        />,
      );
    }

    result.push(
      <CompactEarnCardItem
        title={t('labels.assets')}
        valuePrepend={<TokenStack tokens={assets} />}
        value={assets.length === 1 ? assets[0].name : ''}
        tooltip={t('tooltips.assets')}
      />,
    );
    return result;
  }, [apy, lockupMonths, tvlUsd, assets]);

  return (
    <CompactEarnCardContainer onClick={onClick}>
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
  );
};
