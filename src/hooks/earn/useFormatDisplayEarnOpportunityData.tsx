import { EntityStack } from '@/components/composite/EntityStack/EntityStack';
import { EntityStackWithBadge } from '@/components/composite/EntityStackWithBadge/EntityStackWithBadge';
import { useChains } from '@/hooks/useChains';
import { getChainName } from '@/utils/chains/getChainName';
import { toCompactValue } from '@/utils/formatNumbers';
import type { TFunction } from 'i18next';
import uniqBy from 'lodash/uniqBy';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { EarnCardVariant } from 'src/components/Cards/EarnCard/EarnCard.types';
import { AvatarSize } from 'src/components/core/AvatarStack/AvatarStack.types';
import type {
  APYItem,
  Chain,
  EarnOpportunityWithLatestAnalytics,
  Protocol,
  Token,
  VaultFees,
} from 'src/types/jumper-backend';
import { capitalizeString } from 'src/utils/capitalizeString';
import { formatLockupInDay } from '@/utils/formatLockupInDay';
import { formatApy } from 'src/utils/numbers/apy';
import { formatTvl } from 'src/utils/numbers/tvl';
import { isZeroApprox } from 'src/utils/numbers/utils';
import type { VaultCapacityDisplay } from './useVaultCapacity';
import { useVaultCapacity } from './useVaultCapacity';

interface EarnCardOverviewItem {
  key: string;
  dataTestId: string;
  label: string;
  value: string;
  valuePrepend?: React.ReactElement;
  tooltip: string;
}

const buildApyItem = (
  apy: APYItem | undefined,
  variant: EarnCardVariant,
  t: TFunction,
): EarnCardOverviewItem | null => {
  if (!apy?.total || isZeroApprox(apy.total)) {
    return null;
  }

  const formatted = formatApy(apy.total);
  return {
    key: 'apy',
    dataTestId: `apy-${apy.total}`,
    label: t('labels.apy'),
    value: formatted,
    tooltip: t('tooltips.apy'),
  };
};

const buildTotalApyItem = (
  apy: APYItem | undefined,
  variant: EarnCardVariant,
  t: TFunction,
): EarnCardOverviewItem | null => {
  const displayedApy = (apy?.base ?? 0) + (apy?.customReward ?? 0);
  if (!displayedApy || isZeroApprox(displayedApy)) {
    return null;
  }

  const formatted = formatApy(displayedApy);
  return {
    key: 'apr',
    dataTestId: `apr-${displayedApy}`,
    label: t('labels.apr'),
    value: formatted,
    tooltip: t('tooltips.apr'),
  };
};

const buildRewardsApyItem = (
  rewardsApy: number | undefined,
  variant: EarnCardVariant,
  t: TFunction,
): EarnCardOverviewItem | null => {
  if (!rewardsApy || isZeroApprox(rewardsApy)) {
    return null;
  }

  const formatted = formatApy(rewardsApy);
  return {
    key: 'rewardsApy',
    dataTestId: `rewardsApy-${rewardsApy}`,
    label: t('labels.rewardsApy'),
    value: formatted,
    tooltip: t('tooltips.rewardsApy'),
  };
};

const buildLockupItem = (
  lockupDays: number | string | undefined,
  variant: EarnCardVariant,
  t: TFunction,
): EarnCardOverviewItem | null => {
  const lockupDaysNumber = Number(lockupDays);
  if (isNaN(lockupDaysNumber) || !lockupDaysNumber) {
    return null;
  }

  const formatted = formatLockupInDay(lockupDaysNumber, t);
  return {
    key: 'lockupPeriod',
    dataTestId: `lockupPeriod-${lockupDaysNumber}`,
    label: t('labels.lockupPeriod'),
    value: formatted,
    tooltip: t('tooltips.lockupPeriod', {
      formattedLockupPeriod: formatted,
    }),
  };
};

const buildTvlItem = (
  tvlUsd: number | string | undefined,
  variant: EarnCardVariant,
  t: TFunction,
): EarnCardOverviewItem | null => {
  const tvlUsdNumber = Number(tvlUsd);
  if (isNaN(tvlUsdNumber) || isZeroApprox(tvlUsdNumber)) {
    return null;
  }

  const formatted = formatTvl(tvlUsdNumber);

  return {
    key: 'tvl',
    dataTestId: `tvl-${tvlUsdNumber}`,
    label: t('labels.tvl'),
    value: formatted,
    tooltip: t('tooltips.tvl'),
  };
};

const buildAssetsItem = (
  assets: Token[],
  variant: EarnCardVariant,
  t: TFunction,
): EarnCardOverviewItem | null => {
  const assetsCount = assets.length;
  if (assetsCount === 0) {
    return null;
  }

  const isOverviewVariant = variant === 'overview';
  const assetsValuePrepend = isOverviewVariant ? (
    <EntityStackWithBadge
      entities={assets}
      badgeEntities={assets.map((asset) => asset.chain)}
      size={AvatarSize.MD}
      badgeSize={AvatarSize['3XS']}
      isContentVisible={false}
    />
  ) : (
    <EntityStack entities={assets} />
  );

  const assetValue = assetsCount === 1 ? assets[0].symbol : '';

  return {
    key: 'assets',
    dataTestId: `assets-${assetValue}`,
    label: t('labels.assets', { count: assetsCount }),
    value: assetValue,
    tooltip: t('tooltips.assets', { count: assetsCount }),
    valuePrepend: assetsValuePrepend,
  };
};

const buildChainsItem = (
  chains: Chain[],
  variant: EarnCardVariant,
  t: TFunction,
  formatter: (chain: Chain) => string,
): EarnCardOverviewItem | null => {
  if (variant !== 'overview') {
    return null;
  }

  const chainsCount = chains.length;
  return {
    key: 'chains',
    dataTestId: `chains-${chains.map((chain) => chain.chainId).join('-')}`,
    label: t('labels.chains', { count: chainsCount }),
    value: chains.map((chain) => formatter(chain)).join(', '),
    tooltip: t('tooltips.chains', { count: chainsCount }),
    valuePrepend: (
      <EntityStack
        entities={chains}
        size={AvatarSize.MD}
        spacing={-1.5}
        direction="row"
        disableBorder
      />
    ),
  };
};

const buildProtocolItem = (
  protocol: Protocol | undefined,
  chains: Chain[],
  variant: EarnCardVariant,
  t: TFunction,
): EarnCardOverviewItem | null => {
  if (variant !== 'overview' || !protocol) {
    return null;
  }

  const protocolValue = protocol.name;

  return {
    key: 'protocol',
    dataTestId: `protocol-${protocolValue}`,
    label: t('labels.protocol'),
    value: capitalizeString(protocolValue),
    tooltip: t('tooltips.protocol'),
    valuePrepend: (
      <EntityStackWithBadge
        entities={[protocol]}
        badgeEntities={chains}
        size={AvatarSize.MD}
        badgeSize={AvatarSize['3XS']}
        isContentVisible={false}
      />
    ),
  };
};

const buildCapacityItems = (
  capacityDisplay: VaultCapacityDisplay,
  variant: EarnCardVariant,
  t: TFunction,
): EarnCardOverviewItem[] => {
  if (variant !== 'overview') {
    return [];
  }

  switch (capacityDisplay.state) {
    case 'unknown':
    case 'unlimited':
      return [];

    case 'capped': {
      const { maxUsd, remainingUsd } = capacityDisplay;
      const items: EarnCardOverviewItem[] = [];
      if (remainingUsd !== undefined) {
        items.push({
          key: 'remainingCapacity',
          dataTestId: `remainingCapacity-${remainingUsd}`,
          label: t('labels.remainingCapacity'),
          value: formatTvl(remainingUsd),
          tooltip: t('tooltips.remainingCapacity'),
        });
      }
      items.push({
        key: 'maxCapacity',
        dataTestId: `maxCapacity-${maxUsd}`,
        label: t('labels.maxCapacity'),
        value: formatTvl(maxUsd),
        tooltip: t('tooltips.maxCapacity'),
      });
      return items;
    }

    case 'capped-native': {
      const { max, remaining, symbol } = capacityDisplay;
      const items: EarnCardOverviewItem[] = [];
      if (remaining !== undefined) {
        items.push({
          key: 'remainingCapacity',
          dataTestId: `remainingCapacity-${remaining}`,
          label: t('labels.remainingCapacity'),
          value: `${toCompactValue(remaining)} ${symbol}`,
          tooltip: t('tooltips.remainingCapacity'),
        });
      }
      items.push({
        key: 'maxCapacity',
        dataTestId: `maxCapacity-${max}`,
        label: t('labels.maxCapacity'),
        value: `${toCompactValue(max)} ${symbol}`,
        tooltip: t('tooltips.maxCapacity'),
      });
      return items;
    }
  }
};

const buildFeeItem = (
  feeKey: keyof VaultFees,
  feeValue: number | undefined,
  label: string,
  tooltip: string,
): EarnCardOverviewItem | null => {
  if (feeValue === undefined || feeValue === null || feeValue === 0) {
    return null;
  }

  return {
    key: feeKey,
    dataTestId: `fee-${feeKey}-${feeValue}`,
    label,
    value: formatApy(feeValue),
    tooltip,
  };
};

const buildFeeItems = (
  fees: VaultFees | undefined,
  variant: EarnCardVariant,
  t: TFunction,
): EarnCardOverviewItem[] => {
  if (variant !== 'overview') {
    return [];
  }
  if (!fees) {
    return [];
  }

  return [
    buildFeeItem(
      'performance',
      fees.performance,
      t('labels.performanceFee'),
      t('tooltips.performanceFee'),
    ),
    buildFeeItem(
      'management',
      fees.management,
      t('labels.managementFee'),
      t('tooltips.managementFee'),
    ),
    buildFeeItem(
      'withdrawal',
      fees.withdrawal,
      t('labels.withdrawalFee'),
      t('tooltips.withdrawalFee'),
    ),
    buildFeeItem(
      'deposit',
      fees.deposit,
      t('labels.depositFee'),
      t('tooltips.depositFee'),
    ),
  ].filter((item): item is EarnCardOverviewItem => item !== null);
};

export const useFormatDisplayEarnOpportunityData = (
  earnOpportunity: EarnOpportunityWithLatestAnalytics | null,
  variant: EarnCardVariant,
) => {
  const { t } = useTranslation();
  const { getChainById } = useChains();
  const capacityDisplay = useVaultCapacity(earnOpportunity, {
    enabled: variant === 'overview',
  });

  return useMemo(() => {
    const lockupDays = earnOpportunity?.lockupDays;
    const protocol = earnOpportunity?.protocol;
    const assets = earnOpportunity?.asset ? [earnOpportunity.asset] : [];
    const rewardsApy = earnOpportunity?.latest.apy.jumperReward;
    const { fees } = earnOpportunity ?? {};

    const chains = uniqBy(
      assets.map((asset) => asset.chain),
      'chainId',
    );

    const { apy, tvlUsd } = earnOpportunity?.latest ?? {};

    const apyItem =
      !!apy?.customReward && apy.customReward > 0
        ? buildTotalApyItem(apy, variant, t)
        : buildApyItem(apy, variant, t);

    // Build all items, passing variant to each builder
    const overviewItems = [
      apyItem,
      lockupDays
        ? buildLockupItem(lockupDays, variant, t)
        : buildRewardsApyItem(rewardsApy, variant, t),
      buildTvlItem(tvlUsd, variant, t),
      buildAssetsItem(assets, variant, t),
      buildChainsItem(chains, variant, t, (chain) =>
        getChainName(chain, getChainById),
      ),
      buildProtocolItem(protocol, chains, variant, t),
      ...buildCapacityItems(capacityDisplay, variant, t),
      ...buildFeeItems(fees, variant, t),
    ].filter((item): item is EarnCardOverviewItem => item !== null);

    return {
      overviewItems,
      chains,
    };
  }, [earnOpportunity, variant, t, getChainById, capacityDisplay]);
};
