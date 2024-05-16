// API call: /meta/_health

const data = { isHealthy: true };

export async function GET(req: any) {
  return Response.json(data);
}
