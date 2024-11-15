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

const NUMBER_OF_TOKENS = 11;

const PopularBridgeSection = ({
  sourceChain,
  sourceToken,
  destinationChain,
  destinationToken,
  chains,
  tokens,
}: PopularBridgeProps) => {
  const sameSymbolTokens = Object.values(tokens)
    .flat()
    .filter((token) => token.symbol === sourceToken.symbol && token.chainId !== destinationChain.id);

  const otherTokens = Object.values(tokens)
    .flat()
    .filter((token) => token.chainId !== destinationChain.id && token.symbol !== sourceToken.symbol)
    .filter((token, index, self) =>
      self.findIndex(t => t.chainId === token.chainId) === index
    )
  const popularBridges = [...sameSymbolTokens, ...otherTokens].slice(0, NUMBER_OF_TOKENS)
    .filter((token) => token.symbol !== sourceToken.symbol || token.chainId !== sourceToken.chainId);

  /*let popularBridges = getTokenByName(tokens, destinationToken?.name ?? '')
    .filter((token) => {
      return token.chainId !== destinationChain.id;
    })
    .filter((token) => {
      const isTokenExistsInSourceChain = tokens[token.chainId].some(
        (tk) => tk.symbol === sourceToken.symbol,
      );
      const isTokenExistsInDestinationChain = tokens[
        destinationChain.id
        ].some((tk) => tk.symbol === destinationToken.symbol);

      return (
        isTokenExistsInDestinationChain && isTokenExistsInSourceChain
      );
    });

  if (popularBridges.length <= NUMBER_OF_TOKENS) {
    // popularBridges = tokens[destinationChain.id].slice(0, NUMBER_OF_TOKENS - popularBridges.length)
    //   .filter((token) => sourceToken.symbol !== token.symbol && sourceToken.chainId !== token.chainId);
    popularBridges = Object.values(tokens)
      .flat()
      .filter((token) => token.chainId !== destinationChain.id)
      .slice(0, NUMBER_OF_TOKENS);
  }*/
  console.log('--', destinationToken, popularBridges);

  return (
    <BridgePageContainer width="100%">
      <Typography variant="h3" marginY={2}>
        Popular bridges
      </Typography>
      <Stack direction="row" flexWrap="wrap">
        {popularBridges
          .map((token) => (
            <MuiLink
              width="50%"
              color="text.primary"
              key={generateKey(token.address)}
              component={Link}
              href={`/bridge/${getChainById(chains, token.chainId)?.name}-${token.symbol}-to-${destinationChain?.name}-${destinationToken?.symbol}`.toLowerCase()}
            >
              Bridge from {token.symbol} on{' '}
              {getChainById(chains, token.chainId)?.name} to{' '}
              {destinationToken?.symbol} on {destinationChain?.name}
            </MuiLink>
          ))}
      </Stack>
    </BridgePageContainer>
  );
};

export default PopularBridgeSection;
