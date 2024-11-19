import type { Chain, ChainId } from '@lifi/sdk';
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
import type {
  BerachainApys,
  BerachainProtocol,
} from '../../const/berachainExampleData';
import { BerachainProgressCard } from '../BerachainProgressCard/BerachainProgressCard';
import { BerachainTooltipTokens } from '../BerachainTooltipTokens/BerachainTooltipTokens';
import {
  BerachainMarketCardBadge,
  BerachainMarketCardHeader,
  BerachainMarketCardWrapper,
  BerchainMarketCardAvatar,
  BerchainMarketCardInfos,
  BerchainMarketCardTokenBox,
} from './BerachainMarketCard.style';

export type BerachainProtocolType =
  | 'Vault'
  | 'Recipe'
  | 'DEX'
  | 'Money Market'
  | 'Staking';

interface BerachainMarketCardProps {
  chainId?: ChainId;
  protocol?: BerachainProtocol;
  apys?: BerachainApys;
  tvl?: string;
  tokens?: string[];
}

export const BerachainMarketCard = ({
  chainId,
  protocol,
  apys,
  tvl,
  tokens,
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
      (token): UseMultipleTokenProps => ({
        chainId,
        tokenAddress: token,
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
      href={`/berachain/explore/${protocol?.slug}`}
      style={{ textDecoration: 'none' }}
    >
      <BerachainMarketCardWrapper>
        <BerachainMarketCardHeader>
          {protocol?.image ? (
            <Image
              src={protocol.image}
              alt={`${protocol.name + ' '}logo`}
              width={20}
              height={20}
            />
          ) : (
            <Skeleton
              variant="rectangular"
              sx={{ width: 96, height: 40, borderRadius: '8px' }}
            />
          )}
          <Typography variant="bodyLargeStrong">{protocol?.name}</Typography>
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
              {fetchedTokens.map((token) => (
                <>
                  {token?.logoURI ? (
                    <Image
                      src={token.logoURI}
                      alt={`${token.name} logo`}
                      width={20}
                      height={20}
                      style={{ borderRadius: '10px' }}
                    />
                  ) : (
                    <Skeleton
                      variant="circular"
                      sx={{ width: 20, height: 20 }}
                    />
                  )}
                  {fetchedTokens.length === 1 && token?.name && (
                    <Typography variant="bodyXSmallStrong">
                      {fetchedTokens[0]?.symbol}
                    </Typography>
                  )}
                </>
              ))}
            </BerchainMarketCardTokenBox>
          </Box>
          {protocol?.type && (
            <Tooltip
              title={
                <BerachainTooltipTokens
                  open={openTokensTooltip}
                  setOpen={setOpenTokensTooltip}
                  anchor={anchorTokensTooltip}
                  setAnchor={setAnchorTokensTooltip}
                  idLabel={tokensTooltipId}
                  idMenu={tokensTooltipMenuId}
                  chainId={chainId}
                  apyTokens={apys?.tokens}
                />
              }
              open={openTokensTooltip ? false : undefined}
              disableFocusListener={openTokensTooltip ? false : undefined}
              disableInteractive={!openTokensTooltip ? false : undefined}
              placement="bottom"
              enterTouchDelay={0}
              arrow
            >
              <BerachainMarketCardBadge
                variant="bodySmall"
                type={protocol?.type}
                // onMouseEnter={(event) => handleTooltip(event, false)}
                // onMouseLeave={(event) => handleTooltip(event, true)}
                id={tokensTooltipId}
                aria-controls={
                  openTokensTooltip ? tokensTooltipMenuId : undefined
                }
                aria-haspopup="true"
                aria-expanded={openTokensTooltip ? 'true' : undefined}
              >
                {protocol.type}
              </BerachainMarketCardBadge>
            </Tooltip>
          )}
        </BerchainMarketCardInfos>
        <BerchainMarketCardInfos>
          <BerachainProgressCard
            title={'TVL'}
            value={tvl}
            tooltip={'TVL tooltip msg lorem ipsum'}
            sx={{ color: alpha(theme.palette.white.main, 0.48) }}
            valueSx={{ color: alpha(theme.palette.white.main, 0.84) }}
          />
          <BerachainProgressCard
            title={'Net APY'}
            value={`${typeof apys?.total === 'number' ? apys?.total + '%' : apys?.total}`}
            tooltip={'Net APY tooltip msg lorem ipsum'}
            sx={{ color: alpha(theme.palette.white.main, 0.48) }}
            valueSx={{ color: alpha(theme.palette.white.main, 0.84) }}
          />
        </BerchainMarketCardInfos>
      </BerachainMarketCardWrapper>
    </Link>
  );
};
