'use client';
import generateKey from '@/app/lib/generateKey';
import { getChainById } from '@/utils/tokenAndChain';
import type { ExtendedChain, Token, TokensResponse } from '@lifi/sdk';
import { Link as MuiLink, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { DynamicPagesContainer } from 'src/components/DynamicPagesContainer';

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
    .filter(
      (token) =>
        token.symbol === sourceToken.symbol &&
        token.chainId !== destinationChain.id,
    );

  const otherTokens = Object.values(tokens)
    .flat()
    .filter(
      (token) =>
        token.chainId !== destinationChain.id &&
        token.symbol !== sourceToken.symbol,
    )
    .filter(
      (token, index, self) =>
        self.findIndex((t) => t.chainId === token.chainId) === index,
    );
  const popularBridges = [...sameSymbolTokens, ...otherTokens]
    .slice(0, NUMBER_OF_TOKENS)
    .filter(
      (token) =>
        token.symbol !== sourceToken.symbol ||
        token.chainId !== sourceToken.chainId,
    );

  return (
    <DynamicPagesContainer width="100%">
      <Typography variant="h3" marginY={2}>
        Popular bridges
      </Typography>
      <Stack direction="row" flexWrap="wrap">
        {popularBridges.map((token) => (
          <MuiLink
            width="50%"
            key={generateKey(token.address)}
            sx={(theme) => ({
              color: theme.palette.text.primary,
            })}
            component={Link}
            href={`/bridge/${getChainById(chains, token.chainId)?.name}-${token.symbol}-to-${destinationChain?.name}-${destinationToken?.symbol}`.toLowerCase()}
          >
            Bridge from {token.symbol} on{' '}
            {getChainById(chains, token.chainId)?.name} to{' '}
            {destinationToken?.symbol} on {destinationChain?.name}
          </MuiLink>
        ))}
      </Stack>
    </DynamicPagesContainer>
  );
};

export default PopularBridgeSection;
