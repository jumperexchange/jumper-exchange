'use client';
import { BridgePageContainer } from '@/app/ui/bridge/BridgePage.style';
import { Link as MuiLink, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import type { ExtendedChain, Token, TokensResponse } from '@lifi/sdk';
import { getChainById, getTokenByName } from '@/utils/tokenAndChain';
import generateKey from '@/app/lib/generateKey';

interface PopularBridgeProps {
  sourceChain: ExtendedChain;
  sourceToken: Token;
  destinationChain: ExtendedChain;
  destinationToken: Token;
  chains: ExtendedChain[];
  tokens: TokensResponse['tokens'];
}

const PopularBridgeSection = ({
  sourceChain,
  sourceToken,
  destinationChain,
  destinationToken,
  chains,
  tokens,
}: PopularBridgeProps) => {
  return (
    <BridgePageContainer width="100%">
      <Typography variant="h3" marginY={2}>
        Popular bridges
      </Typography>
      <Stack direction="row" flexWrap="wrap">
        {getTokenByName(tokens, destinationToken?.name ?? '')
          .filter((token) => {
            return token.chainId !== destinationChain.id;
          })
          .filter((token) => {
            const isTokenExistsInSourceChain = tokens[token.chainId].some((tk) => tk.symbol === sourceToken.symbol);
            const isTokenExistsInDestinationChain = tokens[destinationChain.id].some((tk) => tk.symbol === destinationToken.symbol);

            return isTokenExistsInDestinationChain && isTokenExistsInSourceChain;
          })
          .map((token) => (
            <MuiLink
              width="50%"
              color="text.primary"
              key={generateKey(token.address)}
              component={Link}
              href={`/bridge/${getChainById(chains, token.chainId)?.name}-${sourceToken.symbol}-to-${destinationChain?.name}-${destinationToken?.symbol}`.toLowerCase()}
            >
              Bridge from {sourceToken.symbol} on{' '}
              {getChainById(chains, token.chainId)?.name} to{' '}
              {destinationToken?.symbol} on {destinationChain?.name}
            </MuiLink>
          ))}
      </Stack>
    </BridgePageContainer>
  );
};

export default PopularBridgeSection;
