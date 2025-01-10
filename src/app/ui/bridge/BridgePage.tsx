'use client';
import { getChainInfoData, getTokenInfoData } from '@/app/ui/bridge/utils';
import { Widget } from '@/components/Widgets/Widget';
import type { ExtendedChain, Token, TokensResponse } from '@lifi/sdk';
import { Container, Stack, Typography } from '@mui/material';
import InformationCard from 'src/app/ui/bridge/InformationCard';
import BridgeExplanationSection from './BridgeExplanation';
import PopularBridgeSection from './PopularBridgeSection';
import StepsExplainerSection from './StepsExplainer';

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
          sx={{ fontSize: { xs: '40px', sm: '40px' } }}
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
          {[sourceChain, destinationChain].map((chain, index) => (
            <InformationCard
              type="Blockchain"
              key={`${chain.id}-${index}`}
              info={{
                logoURI: chain?.logoURI,
                name: chain.name,
              }}
              data={getChainInfoData(chain)}
            />
          ))}
          {[sourceToken, destinationToken].map((token, index) => (
            <InformationCard
              type="Token"
              key={`${token.address}-${index}`}
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
