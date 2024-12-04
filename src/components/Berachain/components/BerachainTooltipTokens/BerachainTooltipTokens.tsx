import type { ChainId } from '@lifi/sdk';
import { Box, Skeleton, Typography } from '@mui/material';
import Image from 'next/image';
import { useMemo } from 'react';
import { useMultipleTokens } from 'src/hooks/useMultipleTokens';
import type { ProtocolApyToken } from 'src/types/questDetails';

interface BerachainTooltipTokensProps {
  chainId?: ChainId;
  apyTokens?: ProtocolApyToken[];
}

export const BerachainTooltipTokens = ({
  chainId,
  apyTokens,
}: BerachainTooltipTokensProps) => {
  const prepareTokenFetch = useMemo(() => {
    if (chainId === undefined || !apyTokens?.length) {
      return undefined;
    }

    return apyTokens.flatMap(
      (tokens, tokenSetIndex) =>
        tokens.tokenAddress?.map((token) => ({
          chainId,
          tokenAddress: token,
          queryKey: ['tokens', chainId, token],
        })) ?? [],
    );
  }, [apyTokens, chainId]);

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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {fetchedTokens.map((token, index) => (
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          key={index}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {token?.logoURI ? (
              <Image
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
          <Typography variant="bodyXSmallStrong">$123.45</Typography>
        </Box>
      ))}
    </Box>
  );
};
