import {
  getStrapiApiAccessToken,
  getStrapiBaseUrl,
} from 'src/utils/strapi/strapiHelper';
import envConfig from '@/config/env-config';
import type { StrapiResponse } from '@/types/strapi';

const BASE_MINI_APP_SETTING_API_ENDPOINT = 'base-mini-app-settings';

export interface MiniAppSettingAttributes {
  id: number;
  documentId: string;
  appId: string;
  url: string;
  // Using any, because it's just a JSON object
  accountAssociation: any;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export async function getMiniAppSettings(): Promise<MiniAppSettingAttributes> {
  const publicUrl = new URL(envConfig.NEXT_PUBLIC_SITE_URL);

  const baseUrl = getStrapiBaseUrl();
  const accessToken = getStrapiApiAccessToken();

  const apiUrl = new URL(
    `${baseUrl}/api/${BASE_MINI_APP_SETTING_API_ENDPOINT}`,
  );
  apiUrl.searchParams.set('filters[url][$eq]', publicUrl.origin);

  const res = await fetch(apiUrl.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    next: { revalidate: 60 * 5 },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch mini app settings: ${apiUrl.toString()} - ${res.statusText}`,
    );
  }

  const data: StrapiResponse<MiniAppSettingAttributes> = await res.json();
  if (!data.data[0]) {
    throw new Error(`No mini app settings found for ${publicUrl.origin}`);
  }
  return data.data[0];
}
