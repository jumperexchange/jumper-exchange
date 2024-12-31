import type { Chain, ChainId } from '@lifi/sdk';
import type { Breakpoint } from '@mui/material';
import { Box, Skeleton, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useChains } from 'src/hooks/useChains';
import type { StrapiImageData } from 'src/types/strapi';
import type { BerachainProtocolType } from '../../berachain.types';
import {
  BerachainMarketCardBadge,
  BerachainMarketCardHeader,
  BerachainMarketCardWrapper,
  BerchainMarketCardInfos,
} from './BerachainMarketCard.style';
import { useTranslation } from 'react-i18next';
import type { EnrichedMarketDataType } from 'royco/queries';
import { useEnrichedAccountBalancesRecipeInMarket } from 'royco/hooks';
import { useAccount } from '@lifi/wallet-management';
import { BeraChainProgressCardComponent } from './StatCard/BerachainProgressCard.style';
import DigitCard from './StatCard/DigitCard';
import DigitTokenSymbolCard from './StatCard/DigitTokenSymbolCard';
import TokenIncentivesCard from './StatCard/TokenIncentivesCard';
import DigitTooltipCard from './StatCard/DigitTooltipCard';
import {
  APY_TOOLTIP,
  DEPOSIT_TOOLTIP,
  DEPOSITED_TOOLTIP,
  TVL_TOOLTIP,
} from '../../const/title';

interface BerachainMarketCardProps {
  roycoData: EnrichedMarketDataType;
  title?: string;
  image?: StrapiImageData;
  type?: BerachainProtocolType;
  apys?: number[];
  tokens?: string[];
  url?: string;
}

export const BerachainMarketCard = ({
  roycoData,
  apys,
  title,
  type,
  image,
  tokens,
  url,
}: BerachainMarketCardProps) => {
  const { account } = useAccount();
  const chainId = roycoData?.chain_id;
  const theme = useTheme();
  const { t } = useTranslation();
  const { chains } = useChains();

  const tokensTooltipId = 'tokens-tooltip-button';
  const tokensTooltipMenuId = 'tokens-tooltip-menu';

  const {
    isLoading: isLoadingRecipe,
    isRefetching: isRefetchingRecipe,
    data: dataRecipe,
  } = useEnrichedAccountBalancesRecipeInMarket({
    chain_id: roycoData?.chain_id!,
    market_id: roycoData?.market_id!,
    account_address: account?.address?.toLowerCase() ?? '',
    custom_token_data: undefined,
  });

  const deposited =
    dataRecipe?.input_token_data_ap?.token_amount &&
    dataRecipe?.input_token_data_ap?.token_amount > 0;

  // What is the purpose of below?
  /*
  const prepareTokenFetch = useMemo(() => {
    if (chainId === undefined || !tokens) {
      return undefined;
    }
    return tokens.map(
      (token, index): UseMultipleTokenProps => ({
        chainId,
        tokenAddress: token,
        queryKey: ['berachain-market-card-tokens', chainId, token, index],
      }),
    );
  }, [chainId, tokens]);

  const {
    tokens: fetchedTokens,
    // isLoading,
    // isError,
  } = useMultipleTokens(prepareTokenFetch);
*/

  return (
    <Link
      href={`/berachain/explore/${roycoData?.market_id}`}
      style={{ textDecoration: 'none' }}
    >
      <BerachainMarketCardWrapper>
        <BerachainMarketCardHeader>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {image ? (
              <Image
                key={`berachain-market-card-token-${image.data.id}`}
                src={`${url}${image.data.attributes.url}`}
                alt={`${image.data.attributes.alternativeText || 'protocol'} logo`}
                width={image.data.attributes.width}
                height={image.data.attributes.height}
                style={{
                  width: '72px',
                  height: 'auto',
                  maxHeight: '72px',
                  objectFit: 'contain',
                }}
              />
            ) : (
              <Skeleton
                variant="rectangular"
                sx={{ width: 92, height: 40, borderRadius: '8px' }}
              />
            )}
            {roycoData?.name ? (
              <Typography
                variant="bodyMediumStrong"
                sx={(theme) => ({
                  typography: {
                    xs: theme.typography.bodySmallStrong,
                    sm: theme.typography.bodyMediumStrong,
                  },
                })}
              >
                {`${title} ${roycoData?.input_token_data?.symbol} Market`}
              </Typography>
            ) : (
              <Skeleton
                variant="text"
                sx={{ width: 96, height: 24, borderRadius: '8px' }}
              />
            )}
          </Box>
          {type && (
            <BerachainMarketCardBadge
              variant="bodySmall"
              type={type}
              id={tokensTooltipId}
              aria-haspopup="true"
            >
              {type}
            </BerachainMarketCardBadge>
          )}
        </BerachainMarketCardHeader>
        <BerchainMarketCardInfos
          sx={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <BeraChainProgressCardComponent
            sx={{
              height: '100%',
              padding: theme.spacing(1.5, 2),
              display: 'flex',
              justifyContent: 'space-between',
              backgroundColor: deposited ? '#291812' : undefined,
              [theme.breakpoints.up('sm' as Breakpoint)]: {
                padding: theme.spacing(1.5, 2),
              },
            }}
          >
            <DigitTokenSymbolCard
              title={deposited ? 'Deposited' : 'Deposit'}
              tooltipText={deposited ? DEPOSITED_TOOLTIP : DEPOSIT_TOOLTIP}
              tokenImage={roycoData?.input_token_data?.image}
              digit={
                deposited
                  ? t('format.currency', {
                      value: dataRecipe?.input_token_data_ap?.token_amount,
                    })
                  : roycoData?.input_token_data?.symbol
              }
            />
            <DigitCard
              title={'TVL'}
              tooltipText={TVL_TOOLTIP}
              digit={
                roycoData?.locked_quantity_usd
                  ? t('format.currency', {
                      value: roycoData?.locked_quantity_usd,
                      notation: 'compact',
                    })
                  : 'N/A'
              }
            />
          </BeraChainProgressCardComponent>
        </BerchainMarketCardInfos>
        <BerchainMarketCardInfos display={'flex'}>
          {roycoData?.incentive_tokens_data?.length > 0 ? (
            <TokenIncentivesCard
              tokens={roycoData?.incentive_tokens_data}
              marketData={roycoData}
            />
          ) : (
            <DigitTooltipCard
              title={'APY'}
              digit={
                roycoData?.annual_change_ratio
                  ? t('format.percent', {
                      value: roycoData?.annual_change_ratio,
                    })
                  : 'N/A'
              }
              tooltipText={APY_TOOLTIP}
            />
          )}
        </BerchainMarketCardInfos>
      </BerachainMarketCardWrapper>
    </Link>
  );
};
