import { Widget } from '@/components/Widgets/Widget';
import type { ExtendedChain, Token, TokensResponse } from '@lifi/sdk';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import BridgeExplanationSection from './BridgeExplanation';
import PopularBridgeSection from './PopularBridgeSection';
import StepsExplainerSection from './StepsExplainer';
import { ChainInformationCard } from '../../../components/InformationCard/variants/ChainInformationCard';
import { TokenInformationCard } from '../../../components/InformationCard/variants/TokenInformationCard';

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
          marginY={2}
          textAlign="center"
          color="text.primary"
          sx={{
            fontSize: { xs: '40px', sm: '40px' },
          }}
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
            <ChainInformationCard key={`${chain.id}-${index}`} chain={chain} />
          ))}
          {[sourceToken, destinationToken].map((token, index) => (
            <TokenInformationCard
              key={`${token.address}-${index}`}
              token={token}
              chains={chains}
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
