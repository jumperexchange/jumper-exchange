'use client';
import generateKey from '@/app/lib/generateKey';
import { getBridgeUrl } from '@/utils/getBridgeUrl';
import { getChainById } from '@/utils/tokenAndChain';
import { isAlphanumeric } from '@/utils/validation-schemas';
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
        token.chainId !== destinationChain.id &&
        isAlphanumeric(token.symbol),
    );

  const otherTokens = Object.values(tokens)
    .flat()
    .filter(
      (token) =>
        token.chainId !== destinationChain.id &&
        token.symbol !== sourceToken.symbol &&
        isAlphanumeric(token.symbol),
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
        {popularBridges
          .map((token) => {
            const sourceChainData = getChainById(chains, token.chainId);
            if (!sourceChainData) {
              return null;
            }

            const bridgeUrl = getBridgeUrl(
              sourceChainData,
              token,
              destinationChain,
              destinationToken,
            );
            if (!bridgeUrl) {
              return null;
            }

            return { token, sourceChainData, bridgeUrl };
          })
          .filter((item): item is NonNullable<typeof item> => item !== null)
          .map(({ token, sourceChainData, bridgeUrl }) => (
            <MuiLink
              width="50%"
              key={generateKey(token.address)}
              sx={(theme) => ({
                color: theme.palette.text.primary,
              })}
              component={Link}
              href={bridgeUrl}
            >
              Bridge from {token.symbol} on {sourceChainData.name} to{' '}
              {destinationToken.symbol} on {destinationChain.name}
            </MuiLink>
          ))}
      </Stack>
    </DynamicPagesContainer>
  );
};

export default PopularBridgeSection;
