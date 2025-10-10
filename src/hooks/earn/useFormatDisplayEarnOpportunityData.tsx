import uniqBy from 'lodash/uniqBy';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatLockupDuration } from 'src/utils/earn/utils';
import { TokenStack } from 'src/components/composite/TokenStack/TokenStack';
import { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';
import { toCompactValue } from 'src/utils/formatNumbers';
import { isZeroApprox } from 'src/utils/numbers/utils';

interface EarnCardOverviewItem {
  key: string;
  label: string;
  value: string;
  valuePrepend?: React.ReactElement;
  tooltip: string;
}

export const useFormatDisplayEarnOpportunityData = (
  earnOpportunity: EarnOpportunityWithLatestAnalytics | null,
) => {
  const { t } = useTranslation();
  return useMemo(() => {
    const overviewItems: EarnCardOverviewItem[] = [];
    const lockupMonths = earnOpportunity?.lockupMonths;
    const assets = earnOpportunity?.asset ? [earnOpportunity.asset] : [];

    const chains = uniqBy(
      assets.map((asset) => asset.chain),
      'chainId',
    );

    const { apy, tvlUsd } = earnOpportunity?.latest ?? {};

    if (apy?.total && !isZeroApprox(apy.total)) {
      const formatted = `${(apy.total * 100).toLocaleString()}%`;
      overviewItems.push({
        key: 'apy',
        label: t('labels.apy'),
        value: formatted,
        tooltip: t('tooltips.apy'),
      });
    }

    const lockupMonthsNumber = Number(lockupMonths);
    if (!isNaN(lockupMonthsNumber) && lockupMonthsNumber) {
      const formatted = formatLockupDuration(lockupMonthsNumber);
      overviewItems.push({
        key: 'lockupPeriod',
        label: t('labels.lockupPeriod'),
        value: formatted,
        tooltip: t('tooltips.lockupPeriod', {
          formattedLockupPeriod: formatted,
        }),
      });
    }

    const tvlUsdNumber = Number(tvlUsd);
    if (!isNaN(tvlUsdNumber) && !isZeroApprox(tvlUsdNumber)) {
      overviewItems.push({
        key: 'tvl',
        label: t('labels.tvl'),
        value: `$${toCompactValue(tvlUsdNumber)}`,
        tooltip: t('tooltips.tvl'),
      });
    }

    const assetsCount = assets.length;
    if (assetsCount > 0) {
      overviewItems.push({
        key: 'assets',
        label: t('labels.assets', { count: assetsCount }),
        value: assetsCount === 1 ? assets[0].name : '',
        tooltip: t('tooltips.assets', { count: assetsCount }),
        valuePrepend: <TokenStack tokens={assets} />,
      });
    }

    return {
      overviewItems,
      chains,
    };
  }, [earnOpportunity]);
};
