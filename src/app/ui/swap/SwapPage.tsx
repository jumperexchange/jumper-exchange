'use client';
import { getChainInfoData } from '@/app/ui/bridge/utils';
import { Widget } from '@/components/Widgets/Widget';
import type { ExtendedChain, Token, TokensResponse } from '@lifi/sdk';
import { Container, Stack, Typography } from '@mui/material';
import InformationCard from 'src/components/InformationCard/InformationCard';
import SwapExplanationSection from './SwapExplanation';
import StepsExplainerSection from './SwapStepsExplainer';

interface SwapPageProps {
  sourceChain: ExtendedChain;
  destinationChain: ExtendedChain;
  tokens: TokensResponse['tokens'];
  sourceToken?: Token;
  destinationToken?: Token;
}

const BridgePage = ({
  sourceChain,
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
          <InformationCard
            type="Blockchain"
            fullWidth={true}
            info={{
              logoURI: sourceChain?.logoURI,
              name: sourceChain.name,
            }}
            data={getChainInfoData(sourceChain)}
          />
        </Stack>
        <SwapExplanationSection />
      </Stack>
    </Container>
  );
};

export default BridgePage;
