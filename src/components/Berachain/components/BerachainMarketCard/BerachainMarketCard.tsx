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
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useChains } from 'src/hooks/useChains';
import type { UseMultipleTokenProps } from 'src/hooks/useMultipleTokens';
import { useMultipleTokens } from 'src/hooks/useMultipleTokens';
import type { ProtocolApys } from 'src/types/questDetails';
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

interface BerachainMarketCardProps {
  chainId?: ChainId;
  image?: StrapiImageData;
  title?: string;
  type?: BerachainProtocolType;
  slug?: string;
  apys?: ProtocolApys;
  tvl?: string;
  tokens?: string[];
  url?: string;
  deposited?: string;
}

export const BerachainMarketCard = ({
  chainId,
  apys,
  slug,
  title,
  type,
  image,
  tvl,
  tokens,
  url,
  deposited,
}: BerachainMarketCardProps) => {
  const theme = useTheme();
  const [anchorTokensTooltip, setAnchorTokensTooltip] =
    useState<null | HTMLElement>(null);
  const [openTokensTooltip, setOpenTokensTooltip] = useState(false);

  const { chains } = useChains();
  const tokenChainDetails = useMemo(
    () => chainId && chains?.find((chainEl: Chain) => chainEl.id === chainId),
    [chainId, chains],
  );

  const tokensTooltipId = 'tokens-tooltip-button';
  const tokensTooltipMenuId = 'tokens-tooltip-menu';
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
  return (
    <Link
      href={`/berachain/explore/${slug}`}
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
          {title ? (
            <Typography variant="bodyLargeStrong">{title}</Typography>
          ) : (
            <Skeleton
              variant="text"
              sx={{ width: 96, height: 24, borderRadius: '8px' }}
            />
          )}
        </BerachainMarketCardHeader>
        <BerchainMarketCardInfos>
          <Box display={'flex'} gap={'8px'}>
            {tokenChainDetails?.logoURI ? (
              <BerchainMarketCardAvatar
                src={tokenChainDetails?.logoURI}
                alt={`${tokenChainDetails.name} logo`}
                width={20}
                height={20}
              />
            ) : (
              <Skeleton variant="circular" sx={{ width: 32, height: 32 }} />
            )}
            <BerchainMarketCardTokenBox>
              {fetchedTokens.length ? (
                fetchedTokens.map((token, index) => (
                  <BerachainMarketCardTokenContainer
                    sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                    key={`berachain-market-card-token-container-${index}`}
                  >
                    {token?.logoURI ? (
                      <Image
                        key={`berachain-market-card-token-${token.name}-${index}`}
                        src={token.logoURI}
                        alt={`${token.name} logo`}
                        width={20}
                        height={20}
                        style={{ borderRadius: '10px' }}
                      />
                    ) : (
                      <Skeleton
                        key={`berachain-market-card-token-skeleton-${index}`}
                        variant="circular"
                        sx={{ width: 20, height: 20 }}
                      />
                    )}
                    {fetchedTokens.length === 1 && token?.name && (
                      <Typography
                        variant="bodyXSmallStrong"
                        key={`berachain-market-card-token-label-${token.name}-${index}`}
                      >
                        {fetchedTokens[0]?.symbol}
                      </Typography>
                    )}
                  </BerachainMarketCardTokenContainer>
                ))
              ) : (
                <Skeleton variant="circular" sx={{ width: 20, height: 20 }} />
              )}
            </BerchainMarketCardTokenBox>
          </Box>
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
        </BerchainMarketCardInfos>
        <BerchainMarketCardInfos
          sx={{
            display: 'grid',
            gridTemplateColumns: deposited ? '1fr 1fr 1fr' : '1fr 1fr',
          }}
        >
          <BerachainProgressCard
            title={'TVL'}
            value={tvl}
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
            valueSx={{ color: alpha(theme.palette.white.main, 0.84) }}
          />
          <Tooltip
            title={
              <BerachainTooltipTokens
                // open={openTokensTooltip}
                // setOpen={setOpenTokensTooltip}
                // anchor={anchorTokensTooltip}
                // setAnchor={setAnchorTokensTooltip}
                // idLabel={tokensTooltipId}
                // idMenu={tokensTooltipMenuId}
                chainId={chainId}
                apyTokens={apys?.tokens}
              />
            }
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
                value={`${typeof apys?.total === 'number' ? apys?.total + '%' : apys?.total || 'N/A'}`}
                tooltip={'Expected return rate on your invested'}
                sx={{
                  height: '100%',
                  padding: theme.spacing(1.5, 2),
                  display: 'flex',
                  [theme.breakpoints.up('sm' as Breakpoint)]: {
                    padding: theme.spacing(1.5, 2),
                  },
                }}
                valueSx={{ color: alpha(theme.palette.white.main, 0.84) }}
              />
            </div>
          </Tooltip>
          {deposited && (
            <BerachainProgressCard
              title={'Deposit'}
              value={'$2,380'}
              sx={{
                height: '100%',
                padding: theme.spacing(1.5, 2),
                display: 'flex',
                [theme.breakpoints.up('sm' as Breakpoint)]: {
                  padding: theme.spacing(1.5, 2),
                },
                backgroundImage:
                  'linear-gradient(rgba(253, 183, 45, 0.20), rgba(253, 183, 45, 0.20))',
              }}
            />
          )}
        </BerchainMarketCardInfos>
        {/* <BerachainMarketCardDeposit chain={tokenChainDetails} /> */}
      </BerachainMarketCardWrapper>
    </Link>
  );
};
