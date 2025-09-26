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
import { formatLockupPeriod } from 'src/utils/formatLockupPeriod';
import Tooltip from '@mui/material/Tooltip';
import { capitalizeString } from 'src/utils/capitalizeString';
import Box from '@mui/material/Box';

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

  const partnerName = useMemo(() => {
    return zapData?.meta.name ? capitalizeString(zapData.meta.name) : '';
  }, [zapData?.meta.name, t]);

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
  const formattedLockupPeriod = formatLockupPeriod(
    analytics?.lockup_period ?? 0,
  );

  const {
    tooltip: apyTooltip,
    value: apyValue,
    label: apyLabel,
  } = useMemo(() => {
    const analyticsBaseApy = analytics?.base_apy;
    const analyticsBoostedApy = analytics?.boosted_apy;
    const analyticsTotalApy = analytics?.total_apy;
    if (analyticsBoostedApy && Number(analyticsBoostedApy) > 0) {
      return {
        tooltip: t('tooltips.boostedApy', {
          baseApy: analyticsBaseApy,
          boostedApy: analyticsBoostedApy,
        }),
        value: analyticsTotalApy,
        label: t('widget.depositCard.boostedApy'),
      };
    }
    return {
      tooltip: t('tooltips.apy'),
      value: analyticsBaseApy,
      label: t('widget.depositCard.apy'),
    };
  }, [analytics?.boosted_apy, analytics?.base_apy, boostedAPY, t]);

  if (!zapData || !token) {
    return <DepositPoolCardSkeleton />;
  }

  const onClickHandler = () => {
    if (!projectData?.integratorPositionLink) {
      return;
    }

    // @TODO add tracking here

    openInNewTab(projectData.integratorPositionLink);
  };

  const hasDeposited = !isLoadingDepositTokenData && !!depositTokenData;

  return (
    <SectionCardContainer>
      <DepositPoolCardContainer>
        <DepositPoolHeaderContainer>
          <BadgeWithChain
            logoURI={zapData?.meta?.logoURI}
            chainId={token?.chainId}
            badgeSize={15}
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

          {formattedLockupPeriod.value && (
            <DepositPoolCardItem
              title={t('widget.depositCard.lockupPeriod')}
              tooltip={t('tooltips.lockupPeriod', {
                formattedLockupPeriod: `${formattedLockupPeriod.value} ${formattedLockupPeriod.unit}`,
              })}
              value={formattedLockupPeriod.value}
              valueAppend={formattedLockupPeriod.unit}
            />
          )}
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
                  badgeSize={9}
                />
              }
              contentStyles={{ alignItems: 'center' }}
            />
          )}
        </Grid>
        {hasDeposited && (
          <Tooltip
            title={t('tooltips.manageYourPosition', {
              partnerName: partnerName,
            })}
            placement={'top'}
            enterTouchDelay={0}
            arrow
          >
            <Box sx={{ display: 'inline-block', width: '100%' }}>
              <Button
                fullWidth
                variant="transparent"
                size="medium"
                endIcon={<OpenInNewRoundedIcon />}
                disabled={!projectData?.integratorPositionLink}
                onClick={onClickHandler}
                styles={(theme) => ({
                  background: (theme.vars || theme).palette.alphaLight100.main,
                  ...theme.applyStyles('light', {
                    background: (theme.vars || theme).palette.alphaDark100.main,
                  }),
                })}
              >
                {t('button.manageYourPosition')}
              </Button>
            </Box>
          </Tooltip>
        )}
      </DepositPoolCardContainer>
    </SectionCardContainer>
  );
};
