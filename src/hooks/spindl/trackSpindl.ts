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
    type: 'impression',
    placement_id: 'notify_message',
    impression_id: impressionId,
    ad_creative_id: adCreativeId,
  };

  const apiUrl = 'https://e.spindlembed.com/v1/external/track';

  try {
    if (process.env.NEXT_PUBLIC_SPINDL_API_KEY) {
      const response = await fetch(apiUrl, {
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
        } else {
          await response.json();
          // console.log('Impression tracked successfully:', data);
        }
      }
    } else {
      console.error('Provide Spindl API key');
    }
  } catch (error) {
    console.error('Error tracking impression:', error);
  }
}
