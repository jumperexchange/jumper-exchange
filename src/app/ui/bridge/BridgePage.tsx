'use client';
import { BridgePageContainer } from '@/app/ui/bridge/BridgePage.style';
import { Container, Link as MuiLink, Stack, Typography } from '@mui/material';
import { Widget } from '@/components/Widgets/Widget';
import Link from 'next/link';
import generateKey from '@/app/lib/generateKey';
import type { ExtendedChain, Token, TokensResponse } from '@lifi/sdk';
import { getChainById, getTokenByName } from '@/utils/tokenAndChain';
import HalfSizeBlock from '@/app/ui/bridge/HalfSizeBlock';
import { getChainInfoData, getTokenInfoData } from '@/app/ui/bridge/utils';
import StepsExplainerSection from './StepsExplainer';
import BridgeExplanationSection from './BridgeExplanation';
import PopularBridgeSection from './PopularBridgeSection';

interface BridgePageProps {
  sourceChain: ExtendedChain;
  sourceToken: Token;
  destinationChain: ExtendedChain;
  destinationToken: Token;
  chains: ExtendedChain[];
  tokens: TokensResponse['tokens'];
}

const BridgePage = ({
  sourceChain,
  sourceToken,
  destinationChain,
  destinationToken,
  chains,
  tokens,
}: BridgePageProps) => {
  return (
    <Container>
      <Stack display="flex" alignItems="center" direction="column">
        <Typography
          variant="h1"
          color="text.primary"
          marginY={2}
          textAlign="center"
          sx={{ fontSize: '40px!important' }}
        >
          How to bridge from {sourceToken.symbol} on {sourceChain.name} to{' '}
          {destinationToken.symbol} on {destinationChain.name}
        </Typography>

        <Widget
          starterVariant="default"
          fromChain={sourceChain?.id}
          toChain={destinationChain?.id}
          fromToken={sourceToken?.address}
          toToken={destinationToken?.address}
        />

        <StepsExplainerSection
          sourceChain={sourceChain}
          sourceToken={sourceToken}
          destinationChain={destinationChain}
          destinationToken={destinationToken}
        />

        <Stack
          direction="row"
          justifyContent="space-between"
          width="100%"
          flexWrap="wrap"
        >
          {[sourceChain, destinationChain].map((chain) => (
            <HalfSizeBlock
              type="Blockchain"
              key={chain.id}
              info={{
                logoURI: chain?.logoURI,
                name: chain.name,
              }}
              data={getChainInfoData(chain)}
            />
          ))}
          {[sourceToken, destinationToken].map((token) => (
            <HalfSizeBlock
              type="Token"
              key={token.address}
              info={{
                logoURI: token?.logoURI,
                name: `${token.name}`,
              }}
              data={getTokenInfoData(chains, token)}
            />
          ))}
        </Stack>

        <BridgeExplanationSection />

        <PopularBridgeSection
          sourceChain={sourceChain}
          sourceToken={sourceToken}
          destinationChain={destinationChain}
          destinationToken={destinationToken}
          chains={chains}
          tokens={tokens}
        />
      </Stack>
    </Container>
  );
};

export default BridgePage;
