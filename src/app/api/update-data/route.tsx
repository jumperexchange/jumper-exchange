import 'server-only';

type TRequest = {
  publicKey: string;
};
export async function POST(request: Request): Promise<Response> {
  const res: TRequest = await request.json();
  const WASH_ENDPOINT_ROOT_URI = 'https://jumper-wash.builtby.dad';

  const response = await fetch(
    `${WASH_ENDPOINT_ROOT_URI}/lifi/${res.publicKey}/update-data`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.WASH_HANDSHAKE as string,
      },
    },
  );
  const decodedResponse = await response.json();

  return Response.json({ res, response: decodedResponse });
}
