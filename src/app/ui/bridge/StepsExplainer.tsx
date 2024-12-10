'use client';
import { BridgePageContainer } from '@/app/ui/bridge/BridgePage.style';
import type { ExtendedChain, Token } from '@lifi/sdk';
import { Link as MuiLink, Typography, useTheme } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import { Divider } from 'src/components/Blog';
import { getWidgetImageProps } from 'src/utils/image-generation/getWidgetImage';
import StepDetail from './StepDetail';

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
  const theme = useTheme();

  const steps = [
    {
      title: 'Step 1: Prepare Your Assets',
      description: `Before you can bridge your assets, you need to ensure you have the necessary funds and assets on the ${sourceChain?.name} network. Make sure you have the correct ${sourceChain?.name} wallet address and that your ${sourceToken?.name} account is funded.`,
      img: getWidgetImageProps(
        sourceToken,
        sourceChain,
        destinationToken,
        destinationChain,
        theme,
        {
          endpoint: 'widget-selection',
          width: 416,
          height: 496,
          alt: 'Widget Selection Image',
        },
      ),
    },
    {
      title: 'Step 2: Check Available Bridge Options',
      description: `There are several bridges available to transfer your assets from ${sourceToken?.name} on ${sourceChain?.name} to ${destinationToken?.name} on ${destinationChain?.name}. Some popular options include:`,
      content: (
        <ul>
          <li>Stargate</li>
          <li>Across</li>
          <li>Circle CCTP</li>
          <li>Allbridge</li>
          <li>Connext</li>
          <li>Symbiosis</li>
          <li>Celer</li>
        </ul>
      ),
      img: getWidgetImageProps(
        sourceToken,
        sourceChain,
        destinationToken,
        destinationChain,
        theme,
        {
          endpoint: 'widget-quotes',
          width: 856,
          height: 490,
          alt: 'Widget Quotes Image',
        },
      ),
    },
    {
      title: 'Step 3: Select a Bridge',
      description: 'To choose your bridge, follow these steps:',
      content: (
        <ul>
          <li>Visualise the different quotes</li>
          <li>
            Check the details for each quote (i.e: amount of tokens received,
            price impact, slippage, number of steps, gas cost, bridging time)
          </li>
        </ul>
      ),
      img: getWidgetImageProps(
        sourceToken,
        sourceChain,
        destinationToken,
        destinationChain,
        theme,
        {
          endpoint: 'widget-review',
          width: 416,
          height: 440,
          alt: 'Widget Review Image',
        },
      ),
    },
    {
      title: 'Step 4: Bridge Your Assets',
      description: `Once you have found a quote you like, you can bridge your assets from ${sourceToken.symbol} on ${sourceChain.name} to ${destinationToken.symbol} on ${destinationChain.name}. Follow these steps:`,
      content: (
        <ul>
          <li>Visualise the different quotes</li>
          <li>
            Check the details for each quote (i.e: amount of tokens received,
            price impact, slippage, number of steps, gas cost, bridging time)
          </li>
        </ul>
      ),
      img: getWidgetImageProps(
        sourceToken,
        sourceChain,
        destinationToken,
        destinationChain,
        theme,
        {
          endpoint: 'widget-execution',
          width: 416,
          height: 432,
          alt: 'Widget Execution Image',
        },
      ),
    },
    {
      title: 'Step 5: Verify Your Bridge',
      description: `After bridging your assets, verify that they have been successfully transferred to the ${destinationChain.name} network. You can do this by either:`,
      content: (
        <ul>
          <li>Clicking on the buttons to see each intermediate transaction</li>
          <li>
            Go to your{' '}
            <MuiLink
              color="text.primary"
              component={Link}
              href="https://jumper.exchange/scan"
            >
              https://jumper.exchange/scan
            </MuiLink>{' '}
            profile to visualize your recent transaction
          </li>
        </ul>
      ),
      img: getWidgetImageProps(
        sourceToken,
        sourceChain,
        destinationToken,
        destinationChain,
        theme,
        {
          endpoint: 'widget-success',
          width: 416,
          height: 432,
          alt: 'Widget Success Image',
        },
      ),
    },
  ];

  return (
    <BridgePageContainer sx={(theme) => ({ marginTop: theme.spacing(4) })}>
      <Typography
        variant="h2"
        color="text.primary"
        marginY={2}
        sx={{ fontSize: '36px' }}
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

      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <Divider />
          <StepDetail
            title={step.title}
            description={step.description}
            content={step.content}
            img={step.img}
          />
        </React.Fragment>
      ))}
    </BridgePageContainer>
  );
};

export default StepsExplainerSection;
