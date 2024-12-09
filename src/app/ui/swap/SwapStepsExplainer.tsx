'use client';
import type { ExtendedChain, Token } from '@lifi/sdk';
import { Link as MuiLink, Typography, useTheme } from '@mui/material';
import Link from 'next/link';
import { Divider } from 'src/components/Blog';
import { SeoPageContainer } from 'src/components/SeoPageContainer.style';
import StepDetail from 'src/components/StepDetail/StepDetail';

interface SwapStepsExplainerProps {
  sourceChain: ExtendedChain;
  sourceToken?: Token;
  destinationToken?: Token;
}

const SwapStepsExplainerSection = ({
  sourceChain,
  sourceToken,
  destinationToken,
}: SwapStepsExplainerProps) => {
  const theme = useTheme();

  return (
    <SeoPageContainer sx={(theme) => ({ marginTop: theme.spacing(4) })}>
      <Typography
        variant="h2"
        color="text.primary"
        marginY={2}
        sx={{ fontSize: '36px!important' }}
      >
        Steps to Swap on {sourceChain.name}
      </Typography>
      <Typography>
        To swap tokens on on {sourceChain?.name}, you will need to follow these
        steps. This guide will walk you through the process of transferring your
        assets.
      </Typography>

      <Divider />
      <StepDetail
        title={'Step 1: Prepare Your Wallet'}
        description={`To swap tokens on ${sourceChain?.name}, you will first need to connect your wallet.`}
        img={{
          imgUrl: `http://localhost:3000/widget/widget-connect-wallet-${theme.palette.mode}.png`,
          width: 416,
          height: 496,
          alt: 'Widget Selection Image',
        }}
      />

      <Divider />
      <StepDetail
        title={`Step 2: Make sure to have Funds on ${sourceChain.name} in your wallet`}
        description={`Before you can swap your assets, you need to ensure you have the
        necessary funds and assets on the ${sourceChain?.name} network.`}
        // img={{
        //   imgUrl: `/api/widget-selection&fromChainId=${sourceChain.id}&toChainId=${sourceChain.id}&amount=${1}&theme=${theme.palette.mode}&isSwap=true`,
        //   width: 416,
        //   height: 496,
        //   alt: 'Widget Selection Image',
        // }}
      />

      <Divider />
      <StepDetail
        title={`Step 3: Select Tokens to Swap`}
        description={
          'There are several XXXXXXXXXX available to transfer your assets.'
        }
        img={{
          imgUrl: `http://localhost:3000/api/widget-selection?fromChainId=${sourceChain.id}&fromToken=${sourceToken?.address}&toChainId=${sourceChain.id}&toToken=${destinationToken?.address}&amount=${1}&theme=${theme.palette.mode}&isSwap=true`,
          width: 416,
          height: 496,
          alt: 'Widget Selection Image',
        }}
      />

      <Divider />
      <StepDetail
        title={`Step 4: Choose a Swap Platform`}
        description={'To choose a route, follow these steps:'}
        content={
          <ul>
            <li>Click on the quote you prefer</li>
            <li>
              Verify the details of the quote (i.e: amount of tokens received,
              price impact, slippage, number of steps, gas cost, bridging time)
            </li>
            <li>Click on "Start" execution</li>
          </ul>
        }
        img={{
          imgUrl: `/api/widget-quotes?fromChainId=${sourceChain.id}&fromToken=${sourceToken?.address}&toChainId=${sourceChain.id}&toToken=${destinationToken?.address}&amount=${1}&theme=${theme.palette.mode}&isSwap=true`,
          width: 856,
          height: 490,
          alt: 'Widget Selection Image',
        }}
      />

      <Divider />
      <StepDetail
        title={`Step 5: Confirm the Transaction`}
        description={
          'To execute the swap, you will be asked to confirm the transaction within your wallet.'
        }
        content={
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
        }
        img={{
          imgUrl: `/api/widget-review?fromChainId=${sourceChain.id}&fromToken=${sourceToken?.address}&toChainId=${sourceChain.id}&toToken=${destinationToken?.address}&amount=${1}&theme=${theme.palette.mode}&isSwap=true`,
          width: 416,
          height: 440,
          alt: 'Widget Selection Image',
        }}
      />

      <Divider />
      <StepDetail
        title={`Step 6: Verify the Transaction`}
        description={`After swapping your assets, verify that they have been successfully
        transferred on the ${sourceChain.name} network. You can do this by
        either:`}
        content={
          <ul>
            <li>
              Clicking on the buttons to see each intermediate transaction
            </li>
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
        }
        img={{
          imgUrl: `/api/widget-success?toChainId=${sourceChain.id}&toToken=${destinationToken?.address}&amount=${1}&theme=${theme.palette.mode}&isSwap=true`,
          width: 416,
          height: 432,
          alt: 'Widget Selection Image',
        }}
      />
    </SeoPageContainer>
  );
};

export default SwapStepsExplainerSection;
