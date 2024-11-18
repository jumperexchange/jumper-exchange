import type { Chain, ChainId } from '@lifi/sdk';
import { alpha, Box, Skeleton, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { useChains } from 'src/hooks/useChains';
import type { UseMultipleTokenProps } from 'src/hooks/useMultipleTokens';
import { useMultipleTokens } from 'src/hooks/useMultipleTokens';
import type { BerachainProtocol } from '../../const/berachainExampleData';
import { BerachainProgressCard } from '../BerachainProgressCard/BerachainProgressCard';
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
  apy?: string;
  tvl?: string;
  tokens?: string[];
}

export const BerachainMarketCard = ({
  chainId,
  protocol,
  apy,
  tvl,
  tokens,
}: BerachainMarketCardProps) => {
  const theme = useTheme();
  const { chains } = useChains();
  const tokenChainDetails = useMemo(
    () => chainId && chains?.find((chainEl: Chain) => chainEl.id === chainId),
    [chainId, chains],
  );

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
    isLoading,
    isError,
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
              {fetchedTokens[0]?.logoURI ? (
                <Image
                  src={fetchedTokens[0].logoURI}
                  alt={''}
                  width={20}
                  height={20}
                  style={{ borderRadius: '10px' }}
                />
              ) : (
                <Skeleton variant="circular" sx={{ width: 20, height: 20 }} />
              )}
              {fetchedTokens[0]?.name ? (
                <Typography variant="bodyXSmallStrong">
                  {fetchedTokens[0]?.symbol}
                </Typography>
              ) : (
                <Skeleton variant="text" sx={{ width: '44px' }} />
              )}
            </BerchainMarketCardTokenBox>
          </Box>
          {protocol?.type && (
            <BerachainMarketCardBadge variant="bodySmall" type={protocol?.type}>
              {protocol.type}
            </BerachainMarketCardBadge>
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
            value={apy}
            tooltip={'Net APY tooltip msg lorem ipsum'}
            sx={{ color: alpha(theme.palette.white.main, 0.48) }}
            valueSx={{ color: alpha(theme.palette.white.main, 0.84) }}
          />
        </BerchainMarketCardInfos>
      </BerachainMarketCardWrapper>
    </Link>
  );
};
