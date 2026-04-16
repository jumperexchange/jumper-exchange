import uniqBy from 'lodash/uniqBy';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatLockupDuration } from 'src/utils/earn/utils';
import type {
  Chain,
  EarnOpportunityWithLatestAnalytics,
  Protocol,
  Token,
} from 'src/types/jumper-backend';
import { formatApy } from 'src/utils/numbers/apy';
import { formatTvl } from 'src/utils/numbers/tvl';
import { isZeroApprox } from 'src/utils/numbers/utils';
import type { EarnCardVariant } from 'src/components/Cards/EarnCard/EarnCard.types';
import { AvatarSize } from 'src/components/core/AvatarStack/AvatarStack.types';
import { capitalizeString } from 'src/utils/capitalizeString';
import type { TFunction } from 'i18next';
import { useChains } from '@/hooks/useChains';
import { getChainName } from '@/utils/chains/getChainName';
import { formatCapInDollar } from '@/utils/numbers/capInDollar';
import { EntityStackWithBadge } from '@/components/composite/EntityStackWithBadge/EntityStackWithBadge';
import { EntityStack } from '@/components/composite/EntityStack/EntityStack';

interface EarnCardOverviewItem {
  key: string;
  dataTestId: string;
  label: string;
  value: string;
  valuePrepend?: React.ReactElement;
  tooltip: string;
}

const buildApyItem = (
  apy: { total: number } | undefined,
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
  lockupMonths: number | string | undefined,
  variant: EarnCardVariant,
  t: TFunction,
): EarnCardOverviewItem | null => {
  const lockupMonthsNumber = Number(lockupMonths);
  if (isNaN(lockupMonthsNumber) || !lockupMonthsNumber) {
    return null;
  }

  const formatted = formatLockupDuration(lockupMonthsNumber);
  return {
    key: 'lockupPeriod',
    dataTestId: `lockupPeriod-${lockupMonthsNumber}`,
    label: t('labels.lockupPeriod'),
    value: formatted,
    tooltip: t('tooltips.lockupPeriod', {
      formattedLockupPeriod: formatted,
    }),
  };
};

const buildCapInDollarItem = (
  capInDollar: number | string | undefined,
  variant: EarnCardVariant,
  t: TFunction,
): EarnCardOverviewItem | null => {
  const capInDollarNumber = Number(capInDollar);
  if (isNaN(capInDollarNumber) || !capInDollarNumber) {
    return null;
  }

  const formatted = formatCapInDollar(capInDollarNumber);
  return {
    key: 'capInDollar',
    dataTestId: `capInDollar-${capInDollarNumber}`,
    label: t('labels.capInDollar'),
    value: formatted,
    tooltip: t('tooltips.capInDollar'),
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

export const useFormatDisplayEarnOpportunityData = (
  earnOpportunity: EarnOpportunityWithLatestAnalytics | null,
  variant: EarnCardVariant,
) => {
  const { t } = useTranslation();
  const { getChainById } = useChains();

  return useMemo(() => {
    const lockupMonths = earnOpportunity?.lockupMonths;
    const capInDollar = earnOpportunity?.capInDollar;
    const protocol = earnOpportunity?.protocol;
    const assets = earnOpportunity?.asset ? [earnOpportunity.asset] : [];
    const rewardsApy = earnOpportunity?.latest.apy.jumperReward;

    const chains = uniqBy(
      assets.map((asset) => asset.chain),
      'chainId',
    );

    const { apy, tvlUsd } = earnOpportunity?.latest ?? {};

    // Build all items, passing variant to each builder
    const overviewItems = [
      buildApyItem(apy, variant, t),
      lockupMonths
        ? buildLockupItem(lockupMonths, variant, t)
        : capInDollar
          ? buildCapInDollarItem(capInDollar, variant, t)
          : buildRewardsApyItem(rewardsApy, variant, t),
      buildTvlItem(tvlUsd, variant, t),
      buildAssetsItem(assets, variant, t),
      buildChainsItem(chains, variant, t, (chain) =>
        getChainName(chain, getChainById),
      ),
      buildProtocolItem(protocol, chains, variant, t),
    ].filter((item): item is EarnCardOverviewItem => item !== null);

    return {
      overviewItems,
      chains,
    };
  }, [earnOpportunity, variant, t, getChainById]);
};
