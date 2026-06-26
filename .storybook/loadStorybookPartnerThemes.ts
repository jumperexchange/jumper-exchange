import config from '../src/config/env-config.ts';
import type { PartnerThemesData } from '../src/types/strapi.ts';
import { PartnerThemeStrapiApi } from '../src/utils/strapi/StrapiApi.ts';
import { NO_PARTNER_THEME_UID } from './partnerThemeConstants.ts';

const STORYBOOK_PARTNER_THEMES_FETCH_TIMEOUT_MS = 5_000;

export interface PartnerThemeToolbarItem {
  value: string;
  title: string;
}

const defaultToolbarItems: PartnerThemeToolbarItem[] = [
  { value: NO_PARTNER_THEME_UID, title: 'None' },
];

function buildPartnerThemesApiUrl(): string {
  const api = new PartnerThemeStrapiApi();

  if (config.NEXT_PUBLIC_ENVIRONMENT === 'development') {
    api.addPaginationParams({ page: 1, pageSize: 50 });
  }

  return decodeURIComponent(api.getApiUrl());
}

function toToolbarItems(
  themes: PartnerThemesData[],
): PartnerThemeToolbarItem[] {
  const items = [...defaultToolbarItems];

  for (const theme of themes) {
    if (!theme.uid || !theme.PartnerName || !theme.SelectableInMenu) {
      continue;
    }

    if (items.some((item) => item.value === theme.uid)) {
      continue;
    }

    items.push({ value: theme.uid, title: theme.PartnerName });
  }

  return items;
}

export async function loadStorybookPartnerThemes(): Promise<
  PartnerThemeToolbarItem[]
> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      STORYBOOK_PARTNER_THEMES_FETCH_TIMEOUT_MS,
    );

    let response: Response;
    try {
      response = await fetch(buildPartnerThemesApiUrl(), {
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      throw new Error(`Strapi responded with ${response.status}`);
    }

    const result = await response.json();
    const themes: PartnerThemesData[] = result.data ?? [];

    return toToolbarItems(themes);
  } catch (error) {
    console.warn(
      '[Storybook] Failed to load partner themes for toolbar',
      error,
    );
    return defaultToolbarItems;
  }
}
