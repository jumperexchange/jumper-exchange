import { Widget } from '@/components/Widgets/Widget';
import type { ExtendedChain, Token, TokensResponse } from '@lifi/sdk';
import { Container, Stack, Typography } from '@mui/material';
import SwapExplanationSection from './SwapExplanation';
import StepsExplainerSection from './SwapStepsExplainer';
import { ChainInformationCard } from 'src/components/InformationCard/variants/ChainInformationCard';

interface SwapPageProps {
  sourceChain: ExtendedChain;
  destinationChain: ExtendedChain;
  chainName: string;
  tokens: TokensResponse['tokens'];
  sourceToken?: Token;
  destinationToken?: Token;
}

const SwapPage = ({
  sourceChain,
  chainName,
  destinationToken,
  sourceToken,
}: SwapPageProps) => {
  return (
    <Container>
      <Stack
        direction="column"
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            color: 'text.primary',
            marginY: 2,
            textAlign: 'center',
            fontSize: '40px!important',
          }}
        >
          Swap tokens on {sourceChain.name}
        </Typography>

        <Widget
          starterVariant="default"
          fromChain={sourceChain?.id}
          toChain={sourceChain?.id}
        />

        <StepsExplainerSection
          sourceChain={sourceChain}
          chainName={chainName}
          sourceToken={sourceToken}
          destinationChain={sourceChain}
          destinationToken={destinationToken}
        />

        <Stack
          direction="row"
          sx={{
            justifyContent: 'space-between',
            width: '100%',
            flexWrap: 'wrap',
          }}
        >
          <ChainInformationCard chain={sourceChain} fullWidth={true} />
        </Stack>
        <SwapExplanationSection />
      </Stack>
    </Container>
  );
};

export default SwapPage;
