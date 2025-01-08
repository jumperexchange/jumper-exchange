'use client';
import { BridgePageContainer } from '@/app/ui/bridge/BridgePage.style';
import type { ExtendedChain, Token } from '@lifi/sdk';
import { Link as MuiLink, Typography } from '@mui/material';
import Link from 'next/link';

interface StepsExplainerProps {
  sourceChain: ExtendedChain;
  sourceToken: Token;
  destinationChain: ExtendedChain;
  destinationToken: Token;
}

const StepsExplainerSection = ({
  sourceChain,
  sourceToken,
  destinationChain,
  destinationToken,
}: StepsExplainerProps) => {
  return (
    <BridgePageContainer sx={(theme) => ({ marginTop: theme.spacing(4) })}>
      <Typography
        variant="h2"
        marginY={2}
        sx={(theme) => ({
          color: theme.palette.text.primary,
          fontSize: '36px!important',
        })}
      >
        Bridge your {sourceToken.symbol} on {sourceChain.name} to{' '}
        {destinationToken.symbol} on {destinationChain.name}
      </Typography>
      <Typography>
        To bridge from {sourceToken?.name} on {sourceChain?.name} to{' '}
        {destinationToken?.name} on {destinationChain?.name}, you will need to
        follow these steps. This guide will walk you through the process of
        transferring your assets from {sourceToken?.name} on {sourceChain?.name}{' '}
        to {destinationToken?.name} on {destinationChain?.name}.
      </Typography>
      <Typography variant="h4" marginY={2} sx={{ fontSize: '24px!important' }}>
        Step 1: Prepare Your Assets
      </Typography>
      <Typography>
        Before you can bridge your assets, you need to ensure you have the
        necessary funds and assets on the {sourceChain?.name} network. Make sure
        you have the correct {sourceChain?.name} wallet address and that your{' '}
        {sourceToken?.name} account is funded.
      </Typography>
      <Typography variant="h4" marginY={2} sx={{ fontSize: '24px!important' }}>
        Step 2: Check Available Bridge Options
      </Typography>
      <Typography>
        There are several bridges available to transfer your assets from{' '}
        {sourceToken?.name} on {sourceChain?.name} to {destinationToken?.name}{' '}
        on {destinationChain?.name}. Some popular options include:
      </Typography>
      <ul>
        <li>Stargate</li>
        <li>Across</li>
        <li>Circle CCTP</li>
        <li>Allbridge</li>
        <li> Connext</li>
        <li>Symbiosis</li>
        <li>Celer</li>
      </ul>
      <Typography variant="h4" marginY={2} sx={{ fontSize: '24px!important' }}>
        Step 3: Select a Bridge
      </Typography>
      <Typography>To choose your bridge, follow these steps:</Typography>
      <ul>
        <li>Visualise the different quotes</li>
        <li>
          Check the details for each quote (i.e: amount of tokens received,
          price impact, slippage, number of steps, gas cost, bridging time)
        </li>
      </ul>
      <Typography variant="h4" marginY={2} sx={{ fontSize: '24px!important' }}>
        Step 4: Bridge Your Assets
      </Typography>
      <Typography>
        Once you have find a quote you like, you can bridge your assets from{' '}
        {sourceToken.symbol} on {sourceChain.name} to {destinationToken.symbol}{' '}
        on {destinationChain.name}. Follow these steps:
      </Typography>
      <ul>
        <li>Click on the quote you prefer</li>
        <li>
          Verify the details of the quote (i.e: amount of tokens received, price
          impact, slippage, number of steps, gas cost, bridging time)
        </li>
        <li>Click on "Start" execution</li>
        <li>
          "Approve" your tokens inside your wallet and wait for the approval
          transaction to go through
        </li>
        <li>
          "Bridge" your tokens inside your wallet and wait for the approval
          transaction to go through
        </li>
      </ul>
      <Typography variant="h4" marginY={2} sx={{ fontSize: '24px!important' }}>
        Step 5: Verify Your Bridge
      </Typography>
      <Typography>
        After bridging your assets, verify that they have been successfully
        transferred to the {destinationChain.name} network. You can do this by
        either:
      </Typography>
      <ul>
        <li>Clicking on the buttons to see each intermediate transaction</li>
        <li>
          Go to your{' '}
          <MuiLink
            component={Link}
            href="https://jumper.exchange/scan"
            sx={(theme) => ({
              color: theme.palette.text.primary,
            })}
          >
            https://jumper.exchange/scan
          </MuiLink>{' '}
          profile to visualize your recent transaction
        </li>
      </ul>
    </BridgePageContainer>
  );
};

export default StepsExplainerSection;
