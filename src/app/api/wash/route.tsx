import type { Token } from '@lifi/sdk';
import 'server-only';
import { WASH_ENDPOINT_ROOT_URI } from 'src/wash/utils/constants';

type TRequest = {
  id: string;
  fromAddress: string;
  fromToken: Token;
  fromAmount: string;
  fromAmountUSD: string;
  fromChainID: number;
  toAddress: string;
  toToken: Token;
  toAmount: string;
  toAmountUSD: string;
  toChainID: number;
  timestamp: number;
};

export async function POST(request: Request): Promise<Response> {
  const res: TRequest = await request.json();

  const response = await fetch(`${WASH_ENDPOINT_ROOT_URI}/lifi/trade`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.WASH_HANDSHAKE as string,
    },
    body: JSON.stringify({
      ...res,
    }),
  });

  return Response.json({ res, response });
}
