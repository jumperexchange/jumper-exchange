/* eslint-disable @next/next/no-img-element */
'use client';

import type { ChainId } from '@lifi/sdk';
import { Box } from '@mui/material';
import { WidgetImageContainer } from '../ImageGeneration.style';
import { WidgetField } from './WidgetImageField';

export const fullWidth = true;

export type HighlightedAreas = 'from' | 'to' | 'amount';

interface WidgetFieldProps {
  height: number;
  width: number;
  toChainId?: ChainId | null;
  toToken?: string | null;
  fromChainId?: ChainId | null;
  fromToken?: string | null;
  amount?: number | null;
  amountUSD?: number | null;
  highlighted?: HighlightedAreas | null;
}

export const WidgetImage = ({
  height,
  width,
  fromToken,
  fromChainId,
  toToken,
  toChainId,
  amount = 0,
  amountUSD,
  highlighted,
}: WidgetFieldProps) => {
  console.log({
    fromToken,
    fromChainId,
    toToken,
    toChainId,
    amount,
    amountUSD,
    highlighted,
  });
  return (
    <div style={{ position: 'relative', width, height }}>
      <img
        alt="Widget Example"
        width={width}
        height={height}
        style={{ margin: 'auto', objectFit: 'contain' }}
        src={'/widget-light-1-empty.png'}
      />
      <WidgetImageContainer>
        {
          //* Source + Destination Token Selection Fields
        }
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            margin: '0 24px',
            ...(fullWidth && { flexDirection: 'column' }),
          }}
        >
          <WidgetField
            fullWidth={fullWidth}
            token={fromToken}
            chainId={fromChainId}
            type="token"
            highlighted={highlighted === 'from'}
          />
          <WidgetField
            fullWidth={fullWidth}
            sx={{ marginTop: '16px' }}
            type="token"
            token={toToken}
            chainId={toChainId}
            highlighted={highlighted === 'to'}
          />
        </Box>
        {
          //* Amount Input Field
        }
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            margin: '0 24px',
          }}
        >
          <WidgetField
            fullWidth={fullWidth}
            type="amount"
            sx={{ marginTop: '16px', width: '368px' }}
            token={fromToken}
            chainId={fromChainId}
            amount={amount}
            amountUSD={amountUSD}
            highlighted={highlighted === 'amount'}
          />
        </Box>
      </WidgetImageContainer>
    </div>
  );
};
