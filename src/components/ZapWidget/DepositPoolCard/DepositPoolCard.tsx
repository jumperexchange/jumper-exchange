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
import { DepositPoolCardSkeleton } from './DepositPoolCardSkeleton';
import { SectionCardContainer } from 'src/components/Cards/SectionCard/SectionCard.style';
import { Button } from 'src/components/Button';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import { ProjectData } from 'src/types/questDetails';
import { openInNewTab } from 'src/utils/openInNewTab';

interface DepositPoolCardProps {
  customInformation?: CustomInformation;
}

export const DepositPoolCard: FC<DepositPoolCardProps> = ({
  customInformation,
}) => {
  const { t } = useTranslation();
  const projectData: ProjectData = useMemo(() => {
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
    isLoadingDepositTokenData,
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

  const {
    tooltip: apyTooltip,
    value: apyValue,
    label: apyLabel,
  } = useMemo(() => {
    if (analytics?.boosted_apy) {
      return {
        tooltip: t('tooltips.boostedApy', {
          baseApy: analytics.base_apy,
          boostedApy: analytics.boosted_apy,
        }),
        value: boostedAPY.toFixed(1),
        label: t('widget.depositCard.boostedApy'),
      };
    }
    return {
      tooltip: t('tooltips.apy'),
      value: analytics?.base_apy,
      label: t('widget.depositCard.apy'),
    };
  }, [analytics?.boosted_apy, analytics?.base_apy, boostedAPY, t]);

  if (!zapData || !token) {
    return <DepositPoolCardSkeleton />;
  }

  const onClickHandler = () => {
    if (!projectData?.integratorLink) {
      return;
    }

    // @TODO add tracking here

    openInNewTab(projectData.integratorLink);
  };

  const hasDeposited = !isLoadingDepositTokenData && !!depositTokenData;

  return (
    <SectionCardContainer>
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
          {apyValue && (
            <DepositPoolCardItem
              title={apyLabel}
              tooltip={apyTooltip}
              value={apyValue}
              valueAppend={'%'}
            />
          )}
          {analytics?.tvl_usd && (
            <DepositPoolCardItem
              title={t('widget.depositCard.tvl')}
              tooltip={t('tooltips.tvl')}
              value={`$${Number(analytics.tvl_usd).toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}`}
            />
          )}

          {/** Re-enable this once we know the duration and conditionally render it */}
          {/* <DepositPoolCardItem
              title={t('widget.depositCard.lockupPeriod')}
              tooltip=""
              value="5"
              valueAppend="months"
            /> */}
          {token?.symbol && token?.logoURI && token?.chainId && (
            <DepositPoolCardItem
              title={t('widget.depositCard.token')}
              tooltip={
                hasDeposited ? t('tooltips.deposited') : t('tooltips.deposit')
              }
              value={token.symbol.toUpperCase()}
              valuePrepend={
                <BadgeWithChain
                  logoURI={token.logoURI}
                  chainId={token.chainId}
                  alt={`${zapData?.meta?.name} protocol`}
                  logoSize={24}
                  badgeSize={8}
                />
              }
              contentStyles={{ alignItems: 'center' }}
            />
          )}
        </Grid>
        {hasDeposited && (
          <Button
            variant="transparent"
            size="medium"
            endIcon={<OpenInNewRoundedIcon />}
            disabled={!projectData?.integratorLink}
            onClick={onClickHandler}
          >
            {t('button.manageYourPosition')}
          </Button>
        )}
      </DepositPoolCardContainer>
    </SectionCardContainer>
  );
};
