import { getSpindlConfig } from './spindlConfig';

interface ImpressionPayload {
  type: string;
  placement_id: string;
  impression_id: string;
  ad_creative_id: string;
}

const SPINDLE_TRACKING_PATH = '/external/track';

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
  const spindlConfig = getSpindlConfig();

  if (!spindlConfig?.apiUrl || !spindlConfig.headers) {
    return;
  }

  const response = await fetch(
    `${spindlConfig.apiUrl}${SPINDLE_TRACKING_PATH}`,
    {
      method: 'POST',
      headers: spindlConfig.headers,
      body: JSON.stringify(payload),
    },
  );

  if (response) {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  }
}
