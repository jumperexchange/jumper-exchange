import { callRequest } from 'src/utils/callRequest';
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
  const spindlConfig = getSpindlConfig();

  if (!spindlConfig) {
    return;
  }

  const payload: ImpressionPayload = {
    type: 'impression',
    placement_id: 'notify_message',
    impression_id: impressionId,
    ad_creative_id: adCreativeId,
  };

  try {
    await callRequest({
      method: 'POST',
      path: SPINDLE_TRACKING_PATH,
      apiUrl: spindlConfig.apiUrl,
      body: payload,
      headers: spindlConfig.headers,
    });
  } catch (error) {
    console.error('Error tracking Spindl impression:', error);
  }
}
