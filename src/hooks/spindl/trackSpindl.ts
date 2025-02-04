import { getSpindlConfig } from './spindlConfig';

interface ImpressionPayload {
  type: string;
  placement_id: string;
  impression_id: string;
  ad_creative_id: string;
}

export async function trackSpindl(
  impressionId: string,
  adCreativeId: string,
): Promise<void> {
  const payload: ImpressionPayload = {
    type: 'impression', // @spindl: Please verify this string is okay to be hard-coded? Or will it change?
    placement_id: 'notify_message', // @spindl: Please verify this string is okay to be hard-coded? Or will it change?
    impression_id: impressionId, // @spindl: Please verify
    ad_creative_id: adCreativeId, // @spindl: Please verify
  };
  const { postUrl } = getSpindlConfig();
  if (postUrl && process.env.NEXT_PUBLIC_SPINDL_API_KEY) {
    const response = await fetch(postUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-ACCESS-KEY': process.env.NEXT_PUBLIC_SPINDL_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    if (response) {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    }
  } else {
    console.error('Provide Spindl API key and URL for tracking');
  }
}
