import 'server-only';

type TResponse = {
  item: string;
  signature: number[];
  message: number[];
  publicKey: string;
};
export async function POST(request: Request): Promise<Response> {
  const res: TResponse = await request.json();
  const WASH_ENDPOINT_ROOT_URI = 'https://jumper-wash.builtby.dad';

  const response = await fetch(
    `${WASH_ENDPOINT_ROOT_URI}/user/${res.publicKey}/item/${res.item}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.WASH_HANDSHAKE as string,
      },
      body: JSON.stringify({
        ...res,
      }),
    },
  );
  const decodedResponse = await response.json();

  return Response.json({ res, response: decodedResponse });
}
