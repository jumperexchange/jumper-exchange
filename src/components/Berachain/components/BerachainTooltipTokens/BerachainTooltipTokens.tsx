import type { ChainId } from '@lifi/sdk';
import { Box, Skeleton, Typography } from '@mui/material';
import Image from 'next/image';
import { useMemo, type Dispatch, type SetStateAction } from 'react';
import { useMultipleTokens } from 'src/hooks/useMultipleTokens';
import type { BerachainApyToken } from '../../const/berachainExampleData';

interface BerachainTooltipTokensProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  anchor: HTMLElement | null;
  setAnchor: Dispatch<SetStateAction<HTMLElement | null>>;
  idLabel: string;
  idMenu: string;
  chainId?: ChainId;
  apyTokens?: BerachainApyToken[];
}

export const BerachainTooltipTokens = ({
  open,
  setOpen,
  anchor,
  setAnchor,
  idLabel,
  idMenu,
  chainId,
  apyTokens,
}: BerachainTooltipTokensProps) => {
  const prepareTokenFetch = useMemo(() => {
    if (chainId === undefined || !apyTokens?.length) {
      return undefined;
    }

    const result = apyTokens.flatMap((tokens, index) => {
      if (!tokens.tokenAddress || !Array.isArray(tokens.tokenAddress)) {
        return [];
      }

      return tokens.tokenAddress.map((token) => {
        return {
          chainId,
          tokenAddress: token,
        };
      });
    });

    return result;
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
