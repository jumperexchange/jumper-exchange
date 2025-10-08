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
      <Stack display="flex" alignItems="center" direction="column">
        <Typography
          variant="h1"
          color="text.primary"
          marginY={2}
          textAlign="center"
          sx={{ fontSize: '40px!important' }}
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
          justifyContent="space-between"
          width="100%"
          flexWrap="wrap"
        >
          <ChainInformationCard chain={sourceChain} fullWidth={true} />
        </Stack>
        <SwapExplanationSection />
      </Stack>
    </Container>
  );
};

export default SwapPage;
