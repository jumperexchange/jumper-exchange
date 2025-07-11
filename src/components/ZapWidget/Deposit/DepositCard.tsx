import BadgeWithChain from '@/components/ZapWidget/BadgeWithChain';
import {
  type ContractCall,
  type TokenAmount,
  useFieldActions,
} from '@lifi/widget';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMissionsMaxAPY } from 'src/hooks/useMissionsMaxAPY';
import { ColoredStatBox } from './DepositCard.style';
import DigitOnlyCard from './Stat/DigitOnlyCard';
import DigitTextCard from './Stat/DigitTextCard';

export interface ItemPriceProps {
  poolName: string;
  token: TokenAmount;
  underlyingToken: TokenAmount;
  contractCalls?: ContractCall[];
  contractTool: {
    logoURI: string;
    name: string;
  };
  chainId: number;
  analytics: {
    base_apy: number;
    total_apy: number;
    tvl_usd: number;
    boosted_apy?: number;
    position?: number;
  };
  claimingIds?: string[] | undefined;
}

export const DepositCard: React.FC<ItemPriceProps> = ({
  poolName,
  token,
  underlyingToken,
  contractCalls,
  contractTool,
  chainId,
  analytics,
  claimingIds,
}) => {
  const { setFieldValue } = useFieldActions();

  const { apy: boostedAPY } = useMissionsMaxAPY(claimingIds, [chainId]);
  const theme = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    if (token) {
      setFieldValue('toChain', token.chainId, { isTouched: true });
      setFieldValue('toToken', token.address, { isTouched: true });
    }
    if (contractCalls) {
      setFieldValue('contractCalls', contractCalls, {
        isTouched: true,
      });
    }
  }, [contractCalls, setFieldValue, token]);

  const hasDeposited = !!analytics?.position && analytics?.position > 0;

  const ANALYTICS_TOOLTIP = useMemo(() => {
    return analytics?.boosted_apy
      ? `${analytics.base_apy}% is the expected yearly return rate of the underlying tokens invested. There is an additional ${analytics.boosted_apy}% in extra rewards paid in other tokens, check the protocol website for more information.`
      : t('tooltips.apy');
  }, [analytics, t]);

  return (
    <Stack spacing={2} padding={2}>
      <Box display="flex" alignItems="center" gap={1}>
        <BadgeWithChain
          chainId={chainId}
          logoURI={contractTool?.logoURI}
          alt={'Protocol'}
        />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {poolName}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" gap={'16px'}>
        <ColoredStatBox>
          <DigitTextCard
            title={hasDeposited ? 'Position' : 'Deposit'}
            tooltipText={
              hasDeposited ? t('tooltips.deposited') : t('tooltips.deposit')
            }
            tokenImage={
              hasDeposited ? token?.logoURI : underlyingToken?.logoURI
            }
            digit={
              hasDeposited
                ? `${Number(analytics?.position).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                : underlyingToken?.symbol
            }
            hasDeposited={hasDeposited ? true : false}
          />
        </ColoredStatBox>
        <ColoredStatBox>
          <DigitOnlyCard
            title={'TVL'}
            tooltipText={t('tooltips.tvl')}
            digit={
              analytics?.tvl_usd
                ? `$${Number(analytics.tvl_usd).toLocaleString('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}`
                : 'N/A'
            }
          />
        </ColoredStatBox>
      </Box>
      <Box display="flex" justifyContent="space-between" gap={'16px'}>
        <ColoredStatBox>
          <DigitOnlyCard
            title={'APY'}
            tooltipText={ANALYTICS_TOOLTIP}
            digit={
              analytics?.total_apy
                ? `${analytics?.total_apy.toFixed(1)}%`
                : 'N/A'
            }
          />
        </ColoredStatBox>
        {!!boostedAPY && boostedAPY > 0 && (
          <ColoredStatBox>
            <DigitOnlyCard
              title={'APY Boost'}
              tooltipText={
                boostedAPY ? t('tooltips.boostedApy', { token: 'LISK' }) : ''
              }
              digit={analytics?.total_apy ? `${boostedAPY.toFixed(1)}%` : 'N/A'}
            />
          </ColoredStatBox>
        )}
      </Box>
    </Stack>
  );
};
