import type { Chain, ChainId } from '@lifi/sdk';
import type { Breakpoint } from '@mui/material';
import {
  alpha,
  Box,
  Skeleton,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useChains } from 'src/hooks/useChains';
import type { UseMultipleTokenProps } from 'src/hooks/useMultipleTokens';
import { useMultipleTokens } from 'src/hooks/useMultipleTokens';
import type { StrapiImageData } from 'src/types/strapi';
import type { BerachainProtocolType } from '../../berachain.types';
import { BerachainProgressCard } from '../BerachainProgressCard/BerachainProgressCard';
import { BerachainTooltipTokens } from '../BerachainTooltipTokens/BerachainTooltipTokens';
import {
  BerachainMarketCardBadge,
  BerachainMarketCardHeader,
  BerachainMarketCardTokenContainer,
  BerachainMarketCardWrapper,
  BerchainMarketCardAvatar,
  BerchainMarketCardInfos,
  BerchainMarketCardTokenBox,
} from './BerachainMarketCard.style';
import { useTranslation } from 'react-i18next';
import type { EnrichedMarketDataType } from 'royco/queries';
import { useEnrichedAccountBalancesRecipeInMarket } from 'royco/hooks';
import { useAccount } from '@lifi/wallet-management';
import TooltipIncentives from '@/components/Berachain/components/BerachainWidget/TooltipIncentives';
import {
  BeraChainProgressCardComponent,
  BeraChainProgressCardContent,
  BeraChainProgressCardHeader,
} from '../BerachainProgressCard/BerachainProgressCard.style';

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
  const [openTokensTooltip] = useState(false);
  const { t } = useTranslation();

  const { chains } = useChains();
  const tokenChainDetails = useMemo(
    () => chains?.find((chainEl: Chain) => chainEl.id === chainId),
    [chainId, chains],
  )!;

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
          {image ? (
            <Image
              key={`berachain-market-card-token-${image.data.id}`}
              src={`${url}${image.data.attributes.url}`}
              alt={`${image.data.attributes.alternativeText || 'protocol'} logo`}
              width={image.data.attributes.width}
              height={image.data.attributes.height}
              style={{
                maxHeight: '40px',
                maxWidth: '92px',
                height: 'auto',
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
            // <Typography variant="bodyLargeStrong">{roycoData?.name}</Typography>
            <Typography
              variant="bodySmall"
              sx={(theme) => ({
                typography: {
                  xs: theme.typography.bodyXSmall,
                  sm: theme.typography.bodySmall,
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
          {type && (
            <BerachainMarketCardBadge
              variant="bodySmall"
              type={type}
              // onMouseEnter={(event) => handleTooltip(event, false)}
              // onMouseLeave={(event) => handleTooltip(event, true)}
              id={tokensTooltipId}
              aria-controls={
                openTokensTooltip ? tokensTooltipMenuId : undefined
              }
              aria-haspopup="true"
              aria-expanded={openTokensTooltip ? 'true' : undefined}
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
            <Box>
              <BeraChainProgressCardContent>
                <BeraChainProgressCardHeader display={'flex'}>
                  <Typography
                    variant="bodySmall"
                    sx={(theme) => ({
                      typography: {
                        xs: theme.typography.bodyXSmall,
                        sm: theme.typography.bodySmall,
                      },
                    })}
                  >
                    {deposited ? 'Deposited' : 'Deposit'}
                  </Typography>
                  <Tooltip
                    title={'Deposit amount'}
                    placement={'top'}
                    enterTouchDelay={0}
                    arrow
                  >
                    <InfoIcon
                      sx={{
                        width: '16px',
                        height: '16px',
                        marginLeft: '4px',
                        color: 'inherit',
                      }}
                    />
                  </Tooltip>
                </BeraChainProgressCardHeader>
                <Box
                  sx={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  <BerachainMarketCardTokenContainer
                    sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                    key={`berachain-market-card-token-container-${roycoData?.input_token_data?.name}`}
                  >
                    {roycoData?.input_token_data?.image ? (
                      <img
                        key={`berachain-market-card-token-${roycoData?.input_token_data?.name}-${roycoData?.input_token_data?.id}`}
                        src={roycoData?.input_token_data?.image}
                        alt={`${roycoData?.input_token_data?.name} logo`}
                        width={24}
                        height={24}
                        style={{ borderRadius: '10px' }}
                      />
                    ) : (
                      <Skeleton
                        key={`berachain-market-card-token-skeleton-${roycoData?.input_token_data?.id}`}
                        variant="circular"
                        sx={{ width: 24, height: 24 }}
                      />
                    )}
                    <Typography
                      variant="titleXSmall"
                      marginTop={'4px'}
                      sx={(theme) => ({
                        typography: {
                          xs: theme.typography.titleXSmall,
                          sm: theme.typography.titleXSmall,
                        },
                      })}
                      key={`berachain-market-card-token-label-${roycoData?.input_token_data?.name}-${roycoData?.input_token_data?.id}`}
                      color={deposited ? theme.palette.primary.main : undefined}
                    >
                      {deposited
                        ? t('format.currency', {
                            value:
                              dataRecipe?.input_token_data_ap?.token_amount_usd,
                          })
                        : roycoData?.input_token_data?.symbol}
                    </Typography>
                  </BerachainMarketCardTokenContainer>
                </Box>
              </BeraChainProgressCardContent>
            </Box>
            <Box>
              <BeraChainProgressCardContent>
                <BeraChainProgressCardHeader display={'flex'}>
                  <Typography
                    variant="bodySmall"
                    sx={(theme) => ({
                      typography: {
                        xs: theme.typography.bodyXSmall,
                        sm: theme.typography.bodySmall,
                      },
                    })}
                  >
                    TVL
                  </Typography>
                  <Tooltip
                    title={'tvl'}
                    placement={'top'}
                    enterTouchDelay={0}
                    arrow
                  >
                    <InfoIcon
                      sx={{
                        width: '16px',
                        height: '16px',
                        marginLeft: '4px',
                        color: 'inherit',
                      }}
                    />
                  </Tooltip>
                </BeraChainProgressCardHeader>
                <Typography
                  variant="titleXSmall"
                  marginTop={'4px'}
                  sx={(theme) => ({
                    typography: {
                      xs: theme.typography.titleXSmall,
                      sm: theme.typography.titleXSmall,
                    },
                  })}
                >
                  {roycoData?.locked_quantity_usd
                    ? t('format.currency', {
                        value: roycoData?.locked_quantity_usd,
                        notation: 'compact',
                      })
                    : 'N/A'}
                </Typography>
              </BeraChainProgressCardContent>
            </Box>
          </BeraChainProgressCardComponent>
        </BerchainMarketCardInfos>
        <BerchainMarketCardInfos
          sx={{
            display: 'flex',
          }}
        >
          {roycoData?.incentive_tokens_data?.length > 0 ? (
            <Tooltip
              title={
                roycoData?.incentive_tokens_data?.length > 0 ? (
                  <TooltipIncentives market={roycoData} />
                ) : (
                  <></>
                )
              }
              open={openTokensTooltip ? false : undefined}
              disableFocusListener={openTokensTooltip ? false : undefined}
              disableInteractive={!openTokensTooltip ? false : undefined}
              placement="top"
              enterTouchDelay={0}
              arrow
            >
              <div style={{ flexGrow: 1 }}>
                <BeraChainProgressCardComponent
                  sx={{
                    height: '100%',
                    padding: theme.spacing(1.5, 2),
                    display: 'flex',
                    [theme.breakpoints.up('sm' as Breakpoint)]: {
                      padding: theme.spacing(1.5, 2),
                    },
                  }}
                >
                  <BeraChainProgressCardContent>
                    <BeraChainProgressCardHeader display={'flex'}>
                      <Typography
                        variant="bodySmall"
                        sx={(theme) => ({
                          typography: {
                            xs: theme.typography.bodyXSmall,
                            sm: theme.typography.bodySmall,
                          },
                        })}
                      >
                        {'Total Incentives'}
                      </Typography>
                      <Tooltip
                        title={''}
                        placement={'top'}
                        enterTouchDelay={0}
                        arrow
                      >
                        <InfoIcon
                          sx={{
                            width: '16px',
                            height: '16px',
                            marginLeft: '4px',
                            color: 'inherit',
                          }}
                        />
                      </Tooltip>
                    </BeraChainProgressCardHeader>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                      }}
                    >
                      {roycoData?.incentive_tokens_data?.map(
                        (incentiveTokenData) => (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              marginTop: '4px',
                            }}
                            key={incentiveTokenData?.id}
                          >
                            <Typography
                              variant="titleXSmall"
                              sx={(theme) => ({
                                typography: {
                                  xs: theme.typography.titleXSmall,
                                  sm: theme.typography.titleXSmall,
                                },
                              })}
                            >
                              {Intl.NumberFormat('en-US', {
                                notation: 'compact',
                                useGrouping: true,
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 1,
                              }).format(incentiveTokenData.token_amount)}{' '}
                              {/* {t('format.decimal', {
                                value: incentiveTokenData.per_input_token,
                              })} */}
                              {/* {incentiveTokenData.symbol} */}
                            </Typography>
                            <img
                              key={`berachain-market-card-token-${incentiveTokenData?.name}-${incentiveTokenData?.id}`}
                              src={incentiveTokenData?.image}
                              alt={`${incentiveTokenData?.name}-logo`}
                              width={24}
                              height={24}
                              style={{
                                borderRadius: '10px',
                                marginLeft: '4px',
                              }}
                            />
                          </Box>
                        ),
                      )}
                    </Box>
                  </BeraChainProgressCardContent>
                </BeraChainProgressCardComponent>
              </div>
            </Tooltip>
          ) : (
            <Tooltip
              title={'Expected return on the tokens invested'}
              open={openTokensTooltip ? false : undefined}
              disableFocusListener={openTokensTooltip ? false : undefined}
              disableInteractive={!openTokensTooltip ? false : undefined}
              placement="top"
              enterTouchDelay={0}
              arrow
            >
              <div style={{ flexGrow: 1 }}>
                <BerachainProgressCard
                  title={'Net APY'}
                  value={
                    roycoData?.annual_change_ratio
                      ? t('format.percent', {
                          value: roycoData?.annual_change_ratio,
                        })
                      : 'N/A'
                  }
                  showTooltipIcon={true}
                  sx={{
                    height: '100%',
                    padding: theme.spacing(1.5, 2),
                    display: 'flex',
                    [theme.breakpoints.up('sm' as Breakpoint)]: {
                      padding: theme.spacing(1.5, 2),
                    },
                  }}
                  valueSx={{
                    color: alpha(theme.palette.white.main, 0.84),
                    fontSize: theme.typography.titleXSmall.fontSize,
                    [theme.breakpoints.up('sm' as Breakpoint)]: {
                      fontSize: theme.typography.titleXSmall.fontSize,
                    },
                  }}
                />
              </div>
            </Tooltip>
          )}
        </BerchainMarketCardInfos>
      </BerachainMarketCardWrapper>
    </Link>
  );
};

{
  /* <>
        <BerchainMarketCardInfos>
          <BerchainMarketCardTokenBox>
            {roycoData?.input_token_data ? (
              // fetchedTokens.map((token, index) => (
              <BerachainMarketCardTokenContainer
                sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                key={`berachain-market-card-token-container-${roycoData?.input_token_data?.name}`}
              >
                {roycoData?.input_token_data?.image ? (
                  <img
                    key={`berachain-market-card-token-${roycoData?.input_token_data?.name}-${roycoData?.input_token_data?.id}`}
                    src={roycoData?.input_token_data?.image}
                    alt={`${roycoData?.input_token_data?.name} logo`}
                    width={20}
                    height={20}
                    style={{ borderRadius: '10px' }}
                  />
                ) : (
                  <Skeleton
                    key={`berachain-market-card-token-skeleton-${roycoData?.input_token_data?.id}`}
                    variant="circular"
                    sx={{ width: 20, height: 20 }}
                  />
                )}

                <Typography
                  variant="bodyXSmallStrong"
                  key={`berachain-market-card-token-label-${roycoData?.input_token_data?.name}-${roycoData?.input_token_data?.id}`}
                >
                  {roycoData?.input_token_data?.symbol}
                </Typography>
              </BerachainMarketCardTokenContainer>
            ) : (
              <Skeleton variant="circular" sx={{ width: 20, height: 20 }} />
            )}
          </BerchainMarketCardTokenBox>
          <BerachainProgressCard
            title={'TVL'}
            value={
              roycoData?.locked_quantity_usd
                ? t('format.currency', {
                    value: roycoData?.locked_quantity_usd,
                    notation: 'compact',
                  })
                : 'N/A'
            }
            tooltip={
              'Total Value Locked is the metric showing the total amount in a pool.'
            }
            sx={{
              height: '100%',
              padding: theme.spacing(1.5, 2),
              display: 'flex',
              [theme.breakpoints.up('sm' as Breakpoint)]: {
                padding: theme.spacing(1.5, 2),
              },
            }}
            valueSx={{
              color: alpha(theme.palette.white.main, 0.84),
              fontSize: theme.typography.titleXSmall.fontSize,
              [theme.breakpoints.up('sm' as Breakpoint)]: {
                fontSize: theme.typography.titleXSmall.fontSize,
              },
            }}
          />
        </BerchainMarketCardInfos>
        </> */
}
