// API call: /meta/_health

const data = { isHealthy: true };

export async function GET() {
  return Response.json(data);
}
