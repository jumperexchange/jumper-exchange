import {
  DepositPoolCardContainer,
  DepositPoolHeaderContainer,
} from './DepositPoolCard.style';
import { useMissionsMaxAPY } from 'src/hooks/useMissionsMaxAPY';
import { FC, useMemo } from 'react';
import { CustomInformation } from 'src/types/loyaltyPass';
import { useEnhancedZapData } from 'src/hooks/zaps/useEnhancedZapData';
import { formatUnits } from 'viem';
import BadgeWithChain from '../BadgeWithChain';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { DepositPoolCardItem } from './DepositPoolCardItem';
import { useTranslation } from 'react-i18next';

interface DepositPoolCardProps {
  customInformation?: CustomInformation;
}

export const DepositPoolCard: FC<DepositPoolCardProps> = ({
  customInformation,
}) => {
  const { t } = useTranslation();
  const projectData = useMemo(() => {
    return customInformation?.projectData;
  }, [customInformation?.projectData]);

  const claimingIds = useMemo(() => {
    return customInformation?.claimingIds;
  }, [customInformation?.claimingIds]);

  const {
    zapData,
    isSuccess: isZapDataSuccess,
    depositTokenData,
    depositTokenDecimals,
  } = useEnhancedZapData(projectData);

  const lpTokenDecimals = Number(depositTokenDecimals ?? 18);

  const analytics = useMemo(
    () => ({
      ...(zapData?.analytics || {}), // Provide default empty object
      position: depositTokenData
        ? formatUnits(depositTokenData as bigint, lpTokenDecimals)
        : 0,
    }),
    [zapData, lpTokenDecimals],
  );

  const token = useMemo(
    () =>
      isZapDataSuccess && zapData
        ? {
            chainId: zapData.market?.depositToken.chainId,
            address: zapData.market?.depositToken.address as `0x${string}`,
            symbol: zapData.market?.depositToken.symbol,
            name: zapData.market?.depositToken.name,
            decimals: zapData.market?.depositToken.decimals,
            priceUSD: '0',
            coinKey:
              zapData.market?.depositToken.symbol ||
              zapData.market?.depositToken.name ||
              '',
            logoURI: zapData.market?.depositToken.logoURI,
            amount: BigInt(0),
          }
        : null,
    [isZapDataSuccess, zapData],
  );

  const { apy: boostedAPY } = useMissionsMaxAPY(claimingIds, [token?.chainId]);

  const apyTooltip = useMemo(() => {
    return analytics?.boosted_apy
      ? `${analytics.base_apy}% is the expected yearly return rate of the underlying tokens invested. There is an additional ${analytics.boosted_apy}% in extra rewards paid in other tokens, check the protocol website for more information.`
      : t('tooltips.apy');
  }, [analytics, t]);

  const apyValue = useMemo(() => {
    return boostedAPY ? boostedAPY.toFixed(1) : analytics?.base_apy;
  }, [boostedAPY, analytics?.base_apy]);

  return (
    <DepositPoolCardContainer>
      <DepositPoolHeaderContainer>
        <BadgeWithChain
          logoURI={zapData?.meta?.logoURI}
          chainId={token?.chainId}
          alt={`${zapData?.meta?.name} protocol`}
        />
        <Typography
          variant="bodyXLargeStrong"
          sx={{ fontWeight: 700 }}
        >{`${zapData?.meta.name} Pool`}</Typography>
      </DepositPoolHeaderContainer>
      <Grid container rowSpacing={3} columnSpacing={2}>
        <DepositPoolCardItem
          title={'Base APY'}
          tooltip={apyTooltip}
          value={apyValue ?? 'N/A'}
          valueAppend={apyValue ? '%' : undefined}
        />
        <DepositPoolCardItem
          title="TVL"
          tooltip={t('tooltips.tvl')}
          value={
            analytics?.tvl_usd
              ? `$${Number(analytics.tvl_usd).toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}`
              : 'N/A'
          }
        />
        {/** Re-enable this once we know the duration */}
        {/* <DepositPoolCardItem
          title="Lockup period"
          tooltip=""
          value="5"
          valueAppend="months"
        /> */}
        <DepositPoolCardItem
          title="Pool token"
          tooltip=""
          value={token?.symbol?.toUpperCase()}
          valuePrepend={
            <BadgeWithChain
              logoURI={token?.logoURI}
              chainId={token?.chainId}
              alt={`${zapData?.meta?.name} protocol`}
              logoSize={24}
              badgeSize={8}
            />
          }
          contentStyles={{ alignItems: 'center' }}
        />
      </Grid>
    </DepositPoolCardContainer>
  );
};
