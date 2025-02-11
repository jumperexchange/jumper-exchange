import type { ExtraRewards } from '@/components/Berachain/BerachainType';
import { BerachainMarketCardWithBadge } from '@/components/Berachain/components/BerachainMarketCard/BerachainMarketCardWithBadge';
import TooltipProgressbar from '@/components/Berachain/components/TooltipProgressbar';
import { useBerachainMarketsFilterStore } from '@/components/Berachain/stores/BerachainMarketsFilterStore';
import { calculateTVLGoal, titleSlicer } from '@/components/Berachain/utils';
import { useAccount } from '@lifi/wallet-management';
import type { Breakpoint } from '@mui/material';
import {
  Box,
  CircularProgress,
  circularProgressClasses,
  Skeleton,
  Typography,
  useTheme,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { EnrichedMarketDataType } from 'royco/queries';
import { useChains } from 'src/hooks/useChains';
import type { StrapiImageData } from 'src/types/strapi';
import type { BerachainProtocolType } from '../../berachain.types';
import {
  APY_TOOLTIP,
  DEPOSIT_TOOLTIP,
  DEPOSITED_TOOLTIP,
  TVL_TOOLTIP,
} from '../../const/title';
import {
  BerachainMarketCardHeader,
  BerachainMarketCardWrapper,
  BerchainMarketCardInfos,
} from './BerachainMarketCard.style';
import { BeraChainProgressCardComponent } from './StatCard/BerachainProgressCard.style';
import DigitCard from './StatCard/DigitCard';
import DigitTokenSymbolCard from './StatCard/DigitTokenSymbolCard';
import DigitTooltipCard from './StatCard/DigitTooltipCard';
import TokenIncentivesCard from './StatCard/TokenIncentivesCard';

interface BerachainMarketCardProps {
  extraRewards?: ExtraRewards;
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
  extraRewards,
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

  const { positionsData } = useBerachainMarketsFilterStore((state) => state);

  const positions = useMemo(() => {
    return positionsData.filter(
      (positionsData) => positionsData.market_id === roycoData.market_id,
    );
  }, [positionsData, roycoData?.market_id, account]);

  const tokensTooltipId = 'tokens-tooltip-button';
  const tokensTooltipMenuId = 'tokens-tooltip-menu';

  const deposited = positions.length > 0;

  const tvlGoal = useMemo(() => {
    return calculateTVLGoal(roycoData);
  }, [roycoData]);

  return (
    <BerachainMarketCardWithBadge extraRewards={extraRewards}>
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
                  src={`${url}${image.data.attributes?.url}`}
                  alt={`${image.data.attributes?.alternativeText || 'protocol'} logo`}
                  width={image.data.attributes?.width}
                  height={image.data.attributes?.height}
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
                  {title}
                </Typography>
              ) : (
                <Skeleton
                  variant="text"
                  sx={{ width: 96, height: 24, borderRadius: '8px' }}
                />
              )}
            </Box>
            {/*            {type && (
              <BerachainMarketCardBadge
                variant="bodySmall"
                type={type}
                id={tokensTooltipId}
                aria-haspopup="true"
              >
                {type}
              </BerachainMarketCardBadge>
            )}*/}
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
                sx={(theme) => ({
                  flexGrow: 1,
                  '.tooltip-icon': {
                    color: theme.palette.alphaLight500.main,
                  },
                  '.title': {
                    color: '#8b8989',
                    fontSize: '0.75rem',
                  },
                })}
                title={deposited ? 'Deposited' : 'Deposit'}
                tooltipText={deposited ? DEPOSITED_TOOLTIP : DEPOSIT_TOOLTIP}
                tokenImage={roycoData?.input_token_data?.image}
                digit={
                  deposited
                    ? t('format.decimal', {
                        value: positions.reduce((sum, item) => {
                          return (
                            sum + (item.input_token_data?.token_amount ?? 0)
                          );
                        }, 0),
                      })
                    : titleSlicer(roycoData?.input_token_data?.symbol ?? '', 11)
                }
                hasDeposited={deposited}
              />
              <DigitCard
                sx={(theme) => ({
                  width: 'auto',
                  '.tooltip-icon': {
                    color: theme.palette.alphaLight500.main,
                  },
                  alignItems: 'flex-end',
                  '.title': {
                    color: '#8b8989',
                    fontSize: '0.75rem',
                  },
                  '.content': {
                    marginTop: 1,
                    display: 'flex',
                    alignItems: 'center',
                  },
                })}
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
                endAdornment={
                  roycoData?.locked_quantity_usd && (
                    <TooltipProgressbar market={roycoData}>
                      <Box
                        sx={{
                          position: 'relative',
                          marginLeft: 1,
                        }}
                      >
                        <CircularProgress
                          variant="determinate"
                          sx={(theme) => ({
                            color: theme.palette.alphaLight200.main,
                          })}
                          size={24}
                          value={100}
                        />
                        <CircularProgress
                          variant="determinate"
                          disableShrink
                          sx={(theme) => ({
                            color: '#FF8425',
                            animationDuration: '550ms',
                            position: 'absolute',
                            right: 0,
                            // background: theme.palette.alphaLight200.main,
                            [`& .${circularProgressClasses.circle}`]: {
                              strokeLinecap: 'round',
                            },
                          })}
                          value={tvlGoal}
                          size={24}
                        />
                      </Box>
                    </TooltipProgressbar>
                  )
                }
              />
            </BeraChainProgressCardComponent>
          </BerchainMarketCardInfos>
          <BerchainMarketCardInfos display={'flex'}>
            {tvlGoal !== 100 && roycoData?.incentive_tokens_data?.length > 0 ? (
              <TokenIncentivesCard
                tokens={roycoData?.incentive_tokens_data}
                marketData={roycoData}
              />
            ) : (
              <DigitTooltipCard
                title={'Rewards per token'}
                digit={
                  tvlGoal === 100
                    ? 'Deposit cap reached.'
                    : roycoData?.annual_change_ratio
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
    </BerachainMarketCardWithBadge>
  );
};
