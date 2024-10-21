import 'server-only';
import { WASH_ENDPOINT_ROOT_URI } from 'src/wash/utils/constants';

type TRequest = {
  id: string;
  fromAddress: string;
  fromAmount: string;
  fromAmountUSD: string;
  fromChainID: number;
  toAddress: string;
  toAmount: string;
  toAmountUSD: string;
  toChainID: number;
};

export async function POST(request: Request): Promise<Response> {
  const res: TRequest = await request.json();

  fetch(`${WASH_ENDPOINT_ROOT_URI}/user/${res.fromAddress}/trade`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...res,
      handshake: process.env.WASH_HANDSHAKE,
    }),
  });

  return Response.json({ res });
}
