import type { SingleStrapiResponse, StrapiResponse } from '@/types/strapi';
import {
  getStrapiApiAccessToken,
  getStrapiBaseUrl,
} from 'src/utils/strapi/strapiHelper';

const BASE_MINI_APP_SETTING_API_ENDPOINT = 'base-mini-app-setting';

export interface MiniAppSettingAttributes {
  id: number;
  documentId: string;
  appId: string;
  accountAssociation: any;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export async function getMiniAppSettings(): Promise<
  SingleStrapiResponse<MiniAppSettingAttributes>
> {
  const baseUrl = getStrapiBaseUrl();
  const accessToken = getStrapiApiAccessToken();

  const apiUrl = `${baseUrl}/api/${BASE_MINI_APP_SETTING_API_ENDPOINT}`;

  const res = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch mini app settings: ${apiUrl} - ${res.statusText}`,
    );
  }

  const data: SingleStrapiResponse<MiniAppSettingAttributes> = await res.json();
  return data;
}
