import uniqBy from 'lodash/uniqBy';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatLockupDuration } from 'src/utils/earn/utils';
import { TokenStack } from 'src/components/composite/TokenStack/TokenStack';
import { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';
import { toCompactValue } from 'src/utils/formatNumbers';
import { isZeroApprox } from 'src/utils/numbers/utils';
import { EarnCardVariant } from 'src/components/Cards/EarnCard/EarnCard.types';
import { ChainStack } from 'src/components/composite/ChainStack/ChainStack';
import { AvatarSize } from 'src/components/core/AvatarStack/AvatarStack.types';
import { capitalizeString } from 'src/utils/capitalizeString';
import { EntityChainStack } from 'src/components/composite/EntityChainStack/EntityChainStack';
import { EntityChainStackVariant } from 'src/components/composite/EntityChainStack/EntityChainStack.types';
import type { TFunction } from 'i18next';

interface EarnCardOverviewItem {
  key: string;
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

  const formatted = `${(apy.total * 100).toLocaleString()}%`;
  return {
    key: 'apy',
    label: t('labels.apy'),
    value: formatted,
    tooltip: t('tooltips.apy'),
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

  return {
    key: 'tvl',
    label: t('labels.tvl'),
    value: `$${toCompactValue(tvlUsdNumber)}`,
    tooltip: t('tooltips.tvl'),
  };
};

const buildAssetsItem = (
  assets: any[],
  variant: EarnCardVariant,
  t: TFunction,
): EarnCardOverviewItem | null => {
  const assetsCount = assets.length;
  if (assetsCount === 0) {
    return null;
  }

  const isOverviewVariant = variant === 'overview';
  const assetsValuePrepend = isOverviewVariant ? (
    <EntityChainStack
      variant={EntityChainStackVariant.Tokens}
      tokens={assets}
      tokensSize={AvatarSize.MD}
      chainsSize={AvatarSize['3XS']}
      isContentVisible={false}
    />
  ) : (
    <TokenStack tokens={assets} />
  );

  return {
    key: 'assets',
    label: t('labels.assets', { count: assetsCount }),
    value: assetsCount === 1 ? assets[0].name : '',
    tooltip: t('tooltips.assets', { count: assetsCount }),
    valuePrepend: assetsValuePrepend,
  };
};

const buildChainsItem = (
  chains: any[],
  variant: EarnCardVariant,
  t: TFunction,
): EarnCardOverviewItem | null => {
  if (variant !== 'overview') {
    return null;
  }

  const chainsCount = chains.length;
  return {
    key: 'chains',
    label: t('labels.chains', { count: chainsCount }),
    value: chains.map((chain) => capitalizeString(chain.chainKey)).join(', '),
    tooltip: t('tooltips.chains', { count: chainsCount }),
    valuePrepend: (
      <ChainStack
        chainIds={chains.map((chain) => chain.chainId.toString())}
        size={AvatarSize.MD}
        spacing={-1.5}
        direction="row"
        disableBorder
      />
    ),
  };
};

const buildProtocolItem = (
  protocol: any | undefined,
  chains: any[],
  variant: EarnCardVariant,
  t: TFunction,
): EarnCardOverviewItem | null => {
  if (variant !== 'overview' || !protocol) {
    return null;
  }

  return {
    key: 'protocol',
    label: t('labels.protocol'),
    value: protocol?.name,
    tooltip: t('tooltips.protocol'),
    valuePrepend: (
      <EntityChainStack
        variant={EntityChainStackVariant.Protocol}
        protocolSize={AvatarSize.MD}
        chainsSize={AvatarSize['3XS']}
        protocol={protocol}
        chains={chains}
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

  return useMemo(() => {
    const lockupMonths = earnOpportunity?.lockupMonths;
    const protocol = earnOpportunity?.protocol;
    const assets = earnOpportunity?.asset ? [earnOpportunity.asset] : [];

    const chains = uniqBy(
      assets.map((asset) => asset.chain),
      'chainId',
    );

    const { apy, tvlUsd } = earnOpportunity?.latest ?? {};

    // Build all items, passing variant to each builder
    const overviewItems = [
      buildApyItem(apy, variant, t),
      buildLockupItem(lockupMonths, variant, t),
      buildTvlItem(tvlUsd, variant, t),
      buildAssetsItem(assets, variant, t),
      buildChainsItem(chains, variant, t),
      buildProtocolItem(protocol, chains, variant, t),
    ].filter((item): item is EarnCardOverviewItem => item !== null);

    return {
      overviewItems,
      chains,
    };
  }, [earnOpportunity, variant, t]);
};
