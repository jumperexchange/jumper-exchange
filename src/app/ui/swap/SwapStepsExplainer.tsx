'use client';
import type { ExtendedChain, Token } from '@lifi/sdk';
import { Link as MuiLink, Typography, useTheme } from '@mui/material';
import Link from 'next/link';
import { Fragment } from 'react';
import { Divider } from 'src/components/Blog';
import { DynamicPagesContainer } from 'src/components/DynamicPagesContainer';
import StepDetail from 'src/components/StepDetail/StepDetail';
import { getWidgetImageProps } from 'src/utils/image-generation/getWidgetImage';

interface SwapStepsExplainerProps {
  sourceChain: ExtendedChain;
  destinationChain: ExtendedChain;
  sourceToken?: Token;
  destinationToken?: Token;
  chainName: string;
}

const SwapStepsExplainerSection = ({
  sourceChain,
  destinationChain,
  sourceToken,
  destinationToken,
  chainName,
}: SwapStepsExplainerProps) => {
  const theme = useTheme();

  const steps = [
    {
      title: 'Step 1: Prepare Your Wallet',
      description: `To swap tokens on ${sourceChain?.name}, you will first need to connect your wallet.`,
      img: {
        imgUrl: `/widget/widget-connect-wallet-${theme.palette.mode}.png`,
        width: 460,
        height: 338,
        alt: 'Widget connection image',
      },
    },
    {
      title: `Step 2: Make sure to have Funds on ${sourceChain.name} in your wallet`,
      description: `Before you can swap your assets, you need to ensure you have the necessary funds and assets on the ${sourceChain?.name} network.`,
      img: getWidgetImageProps({
        theme,
        chainName,
        amount: 1,
        widgetImageProps: {
          endpoint: 'widget-amounts',
          width: 416,
          height: 536,
          alt: 'Widget Amounts Image',
        },
      }),
    },
    {
      title: `Step 3: Select Tokens to Swap`,
      description:
        'There are several options available to transfer your assets.',
      img: getWidgetImageProps({
        sourceToken,
        sourceChain,
        destinationChain,
        destinationToken,
        theme,
        widgetImageProps: {
          endpoint: 'widget-selection',
          width: 416,
          height: 496,
          alt: 'Widget Selection Image',
        },
        isSwap: true,
      }),
    },
    {
      title: `Step 4: Choose a Swap Platform`,
      description: 'To choose a route, follow these steps:',
      content: (
        <ul>
          <li>Click on the quote you prefer</li>
          <li>
            Verify the details of the quote (i.e., amount of tokens received,
            price impact, slippage, number of steps, gas cost, bridging time)
          </li>
          <li>Click on "Review swap"</li>
        </ul>
      ),
      img: getWidgetImageProps({
        sourceToken,
        sourceChain,
        destinationChain,
        destinationToken,
        theme,
        widgetImageProps: {
          endpoint: 'widget-quotes',
          width: 856,
          height: 490,
          alt: 'Widget Quotes Image',
        },
        isSwap: true,
      }),
    },
    {
      title: `Step 5: Confirm the Transaction`,
      description:
        'To execute the swap, you will be asked to confirm the transaction within your wallet.',
      content: (
        <ul>
          <li>
            "Approve" your tokens inside your wallet and wait for the approval
            transaction to go through
          </li>
          <li>
            "Swap" your tokens inside your wallet and wait for the approval
            transaction to go through
          </li>
        </ul>
      ),
      img: getWidgetImageProps({
        sourceToken,
        sourceChain,
        destinationChain,
        destinationToken,
        theme,
        widgetImageProps: {
          endpoint: 'widget-review',
          width: 416,
          height: 440,
          alt: 'Widget Review Image',
        },
        isSwap: true,
      }),
    },
    {
      title: `Step 6: Verify the Transaction`,
      description: `After swapping your assets, verify that they have been successfully transferred on the ${sourceChain.name} network. You can do this by either:`,
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
      img: getWidgetImageProps({
        sourceToken,
        sourceChain,
        destinationChain,
        destinationToken,
        theme,
        widgetImageProps: {
          endpoint: 'widget-success',
          width: 416,
          height: 432,
          alt: 'Widget Success Image',
        },
        isSwap: true,
      }),
    },
  ];

  return (
    <DynamicPagesContainer sx={(theme) => ({ marginTop: theme.spacing(4) })}>
      <Typography
        variant="h2"
        color="text.primary"
        marginY={2}
        sx={{ fontSize: '36px!important' }}
      >
        Steps to Swap tokens on {sourceChain.name}
      </Typography>
      <Typography>
        To swap tokens on {sourceChain?.name}, you will need to follow these
        steps. This guide will walk you through the process of transferring your
        assets.
      </Typography>

      {steps.map((step, index) => (
        <Fragment key={index}>
          <Divider />
          <StepDetail
            title={step.title}
            description={step.description}
            content={step.content}
            img={step.img}
          />
        </Fragment>
      ))}
    </DynamicPagesContainer>
  );
};

export default SwapStepsExplainerSection;
