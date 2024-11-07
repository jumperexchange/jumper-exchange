import type { Token } from '@lifi/sdk';
import 'server-only';

type TRequest = {
  id: string;
  txHash: string;
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
  const WASH_ENDPOINT_ROOT_URI = 'https://jumper-wash.builtby.dad';

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
  const decodedResponse = await response.json();

  return Response.json({ res, response: decodedResponse });
}
