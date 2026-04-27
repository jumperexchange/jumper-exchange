import type {
  HttpResponse,
  JumperBackend,
  MissionApyResponse,
} from '@/types/jumper-backend';
import { makeClient } from './client';

export type GetMissionApyResult = HttpResponse<MissionApyResponse, unknown>;

export type GetMissionApyRequestParams = Parameters<
  JumperBackend<unknown>['v1']['missionControllerGetApyV1']
>[1];

export async function getMissionApy(
  slug: string,
  params: GetMissionApyRequestParams = {},
): Promise<GetMissionApyResult> {
  const client = makeClient();
  return client.v1.missionControllerGetApyV1(slug, params);
}

export type GetMissionTaskApyResult = HttpResponse<MissionApyResponse, unknown>;

export type GetMissionTaskApyRequestParams = Parameters<
  JumperBackend<unknown>['v1']['missionControllerGetTaskApyV1']
>[2];

export async function getMissionTaskApy(
  slug: string,
  identifier: string,
  params: GetMissionTaskApyRequestParams = {},
): Promise<GetMissionTaskApyResult> {
  const client = makeClient();
  return client.v1.missionControllerGetTaskApyV1(slug, identifier, params);
}
