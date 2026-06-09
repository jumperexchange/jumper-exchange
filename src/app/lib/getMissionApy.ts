import { makeClient } from './client';

export async function getMissionApy(slug: string) {
  const client = makeClient();
  return client.v1.missionControllerGetApyV1(slug);
}

export async function getMissionTaskApy(slug: string, identifier: string) {
  const client = makeClient();
  return client.v1.missionControllerGetTaskApyV1(slug, identifier);
}
