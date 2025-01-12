import {
  type ContractCall,
  type TokenAmount,
  useFieldActions,
} from '@lifi/widget';
import { Avatar, Box, Chip, Stack, Typography, useTheme } from '@mui/material';
import { useEffect } from 'react';
import DigitCard from 'src/components/Berachain/components/BerachainMarketCard/StatCard/DigitCard';
import DigitTokenSymbolCard from 'src/components/Berachain/components/BerachainMarketCard/StatCard/DigitTokenSymbolCard';
import {
  DEPOSIT_TOOLTIP,
  DEPOSITED_TOOLTIP,
} from 'src/components/Berachain/const/title';
import { useTranslation } from 'react-i18next';
import { useMissionsMaxAPY } from 'src/hooks/useMissionsMaxAPY';

export interface ItemPriceProps {
  token: TokenAmount;
  underlyingToken: TokenAmount;
  contractCalls?: ContractCall[];
  contractTool: {
    logoURI: string;
    name: string;
  };
  analytics: any;
  claimingIds?: string[] | undefined;
}

export const DepositCard: React.FC<ItemPriceProps> = ({
  token,
  underlyingToken,
  contractCalls,
  contractTool,
  analytics,
  claimingIds,
}) => {
  const { setFieldValue } = useFieldActions();

  const { apy: boostedAPY } = useMissionsMaxAPY(claimingIds);
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

  return (
    <Stack spacing={2} padding={2}>
      <Box display="flex" alignItems="center" gap={1}>
        <Avatar alt="Protocol" src={contractTool?.logoURI} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {`${contractTool?.name} ${underlyingToken?.symbol.toUpperCase()} Pool`}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" gap={'16px'}>
        <Box
          sx={{
            backgroundColor: theme.palette?.bgSecondary?.main,
            alignItems: 'flex-start',
            borderRadius: 1,
            paddingX: 2,
            paddingY: 1,
            flex: 1,
          }}
        >
          <DigitTokenSymbolCard
            title={hasDeposited ? 'Deposited' : 'Deposit'}
            tooltipText={hasDeposited ? DEPOSITED_TOOLTIP : DEPOSIT_TOOLTIP}
            tokenImage={underlyingToken?.logoURI}
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
          {/* <DigitCard
            // sx={
            //   {
            //     // alignItems: 'flex-end',
            //   }
            // }
            title={'TVL'}
            tooltipText={'hello world'}
            digit={
              analytics?.tvl_usd
                ? `$${Number(analytics.tvl_usd).toLocaleString('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}`
                : 'N/A'
            }
          /> */}
          {/* <Typography variant="subtitle2">TVL</Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {analytics?.tvl_usd
              ? `$${Number(analytics.tvl_usd).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : 'N/A'}
          </Typography> */}
        </Box>
        <Box
          sx={{
            backgroundColor: theme.palette?.bgSecondary?.main,
            alignItems: 'flex-start',
            borderRadius: 1,
            paddingX: 2,
            paddingY: 1,
            flex: 1,
          }}
        >
          <DigitCard
            // sx={
            //   {
            //     // alignItems: 'flex-end',
            //   }
            // }
            title={'TVL'}
            tooltipText={'hello world'}
            digit={
              analytics?.tvl_usd
                ? `$${Number(analytics.tvl_usd).toLocaleString('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}`
                : 'N/A'
            }
          />
          {/* <Typography variant="subtitle2">TVL</Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {analytics?.tvl_usd
              ? `$${Number(analytics.tvl_usd).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : 'N/A'}
          </Typography> */}
        </Box>
        {/* <Box
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            borderRadius: 1,
            paddingX: 2,
            paddingY: 1,
            flex: 1,
          }}
        >
          <Typography variant="subtitle2">Incentives</Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {analytics?.total_apy
              ? `${analytics?.total_apy.toFixed(2)}%`
              : 'N/A'}
          </Typography>
        </Box> */}
      </Box>
      <Box display="flex" justifyContent="space-between" gap={'16px'}>
        <Box
          sx={{
            backgroundColor: theme.palette?.bgSecondary?.main,
            alignItems: 'flex-start',
            borderRadius: 1,
            paddingX: 2,
            paddingY: 1,
            flex: 1,
          }}
        >
          <DigitCard
            title={'APY'}
            tooltipText={'hello world'}
            digit={
              analytics?.total_apy
                ? `${analytics?.total_apy.toFixed(1)}%`
                : 'N/A'
            }
          />
        </Box>
        {!!boostedAPY && boostedAPY > 0 && (
          <Box
            sx={{
              backgroundColor: theme.palette?.bgSecondary?.main,
              alignItems: 'flex-start',
              borderRadius: 1,
              paddingX: 2,
              paddingY: 1,
              flex: 1,
            }}
          >
            <DigitCard
              title={'Boosted APY'}
              tooltipText={'hello world'}
              digit={analytics?.total_apy ? `${boostedAPY.toFixed(1)}%` : 'N/A'}
            />
          </Box>
        )}
      </Box>
    </Stack>
  );
};
