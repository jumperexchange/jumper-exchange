import type { ChainId } from '@lifi/sdk';
import { Box, Skeleton, Typography } from '@mui/material';
import Image from 'next/image';
import { useMemo } from 'react';
import { useMultipleTokens } from 'src/hooks/useMultipleTokens';
import type { ProtocolApyToken } from 'src/types/questDetails';
import type { EnrichedMarketDataType } from 'royco/queries';
import { useTranslation } from 'react-i18next';

interface BerachainTooltipTokensProps {
  chainId?: number | null;
  data?: EnrichedMarketDataType;
}

export const BerachainTooltipTokens = ({
  data,
}: BerachainTooltipTokensProps) => {
  const { t } = useTranslation();
  const apys =
    data?.annual_change_ratios
      ?.map((d, index) => {
        const [chain_id, token_address] =
          data?.incentive_ids?.[index]?.split('-') ?? [];
        return {
          // chain_id: 1,
          // token_address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          chain_id,
          token_address,
          annual_change_ratio: data?.annual_change_ratios?.[index],
          base_incentive_amount: data?.base_incentive_amounts?.[index],
          base_incentive_id: data?.base_incentive_ids?.[index],
          base_start_timestamp: data?.base_start_timestamps?.[index],
          base_end_timestamp: data?.base_end_timestamps?.[index],
          base_incentive_rate: data?.base_incentive_rates?.[index],
          incentive_amount: data?.incentive_amounts?.[index],
          incentive_amount_usd: data?.incentive_amounts_usd?.[index],
          incentive_id: data?.incentive_ids?.[index],
          incentive_rate: data?.incentive_rates?.[index],
          incentive_rate_usd: data?.incentive_rates_usd?.[index],
          incentive_token_fdv_value: data?.incentive_token_fdv_values?.[index],
          incentive_token_price_value:
            data?.incentive_token_price_values?.[index],
          incentive_token_total_supply_value:
            data?.incentive_token_total_supply_values?.[index],
        };
      })
      .filter((d) => d.annual_change_ratio !== 0) ?? [];

  // TODO: to remove
  // eslint-disable-next-line no-console
  console.log('apys', apys);

  const prepareTokenFetch = useMemo(() => {
    return apys.map((token, tokenSetIndex) => ({
      chainId: token.chain_id as unknown as ChainId,
      tokenAddress: token.token_address,
      queryKey: ['tokens', token.chain_id, token.token_address],
    }));
  }, [apys]);

  // TODO: to remove
  // eslint-disable-next-line no-console
  console.log('prepareTokenFetch', prepareTokenFetch);

  const {
    tokens: fetchedTokens,
    // isLoading,
    // isError,
  } = useMultipleTokens(prepareTokenFetch);

  if (
    fetchedTokens.filter((fetchedToken) => fetchedToken !== null).length === 0
  ) {
    return null;
  }

  // TODO: to remove
  // eslint-disable-next-line no-console
  console.log('abc', fetchedTokens);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {fetchedTokens.map((token, index) => (
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          key={index}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {token?.logoURI ? (
              <img
                src={token?.logoURI}
                alt={`${token.name} logo`}
                width={16}
                height={16}
                style={{ borderRadius: '13px' }}
              />
            ) : (
              <Skeleton
                variant="circular"
                sx={{ width: '16px', height: '16px' }}
              />
            )}
            <Typography variant="bodyXSmall">{token?.name}</Typography>
          </Box>
          <Typography variant="bodyXSmallStrong">
            {apys[index].annual_change_ratio
              ? t('format.percent', { value: apys[index].annual_change_ratio })
              : 'N/A'}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};
