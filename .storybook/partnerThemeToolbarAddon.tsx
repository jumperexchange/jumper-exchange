import React, { useEffect, useMemo, useState } from 'react';
import { Select } from 'storybook/internal/components';
import { addons, types, useGlobals } from 'storybook/manager-api';
import { NO_PARTNER_THEME_UID } from './partnerThemeConstants.ts';

const PaintBrushIcon = () => (
  <svg
    width={14}
    height={14}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.854.146a.5.5 0 00-.708 0L2.983 8.31a2.24 2.24 0 00-1.074.6C.677 10.14.24 11.902.085 12.997 0 13.6 0 14 0 14s.4 0 1.002-.085c1.095-.155 2.857-.592 4.089-1.824a2.24 2.24 0 00.6-1.074l8.163-8.163a.5.5 0 000-.708l-2-2zM5.6 9.692l.942-.942L5.25 7.457l-.942.943A2.242 2.242 0 015.6 9.692zm1.649-1.65L12.793 2.5 11.5 1.207 5.957 6.75 7.25 8.043zM4.384 9.617a1.25 1.25 0 010 1.768c-.767.766-1.832 1.185-2.78 1.403-.17.04-.335.072-.49.098.027-.154.06-.318.099-.49.219-.947.637-2.012 1.403-2.779a1.25 1.25 0 011.768 0z"
      fill="currentColor"
    />
  </svg>
);

const JUMPER_STRAPI_URL = 'https://strapi.jumper.xyz';
const FETCH_TIMEOUT_MS = 5_000;
const ADDON_ID = 'partner-theme-toolbar';

interface PartnerThemeToolbarItem {
  value: string;
  title: string;
}

interface PartnerThemeListItem {
  uid?: string;
  PartnerName?: string;
  SelectableInMenu?: boolean;
}

/** Minimal Strapi list query for the toolbar menu (manager bundle cannot import app Strapi helpers). */
const buildPartnerThemesMenuApiUrl = (): string => {
  const strapiUrl =
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_STRAPI_URL) ||
    JUMPER_STRAPI_URL;
  const environment =
    typeof process !== 'undefined'
      ? (process.env.NEXT_PUBLIC_ENVIRONMENT ?? '')
      : '';

  const url = new URL(`${strapiUrl}/api/partner-themes`);
  url.searchParams.set('fields[0]', 'uid');
  url.searchParams.set('fields[1]', 'PartnerName');
  url.searchParams.set('fields[2]', 'SelectableInMenu');

  if (environment !== 'production') {
    url.searchParams.set('status', 'draft');
  }

  if (environment === 'development') {
    url.searchParams.set('pagination[page]', '1');
    url.searchParams.set('pagination[pageSize]', '50');
    url.searchParams.set('pagination[withCount]', 'true');
  }

  return decodeURIComponent(url.href);
};

const toToolbarItems = (
  themes: PartnerThemeListItem[],
): PartnerThemeToolbarItem[] => {
  const items: PartnerThemeToolbarItem[] = [
    { value: NO_PARTNER_THEME_UID, title: 'None' },
  ];

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
};

const loadPartnerThemeToolbarItems = async (): Promise<
  PartnerThemeToolbarItem[]
> => {
  const fallback: PartnerThemeToolbarItem[] = [
    { value: NO_PARTNER_THEME_UID, title: 'None' },
  ];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(buildPartnerThemesMenuApiUrl(), {
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      throw new Error(`Strapi responded with ${response.status}`);
    }

    const result = await response.json();
    return toToolbarItems(result.data ?? []);
  } catch (error) {
    console.warn(
      '[Storybook] Failed to load partner themes for toolbar',
      error,
    );
    return fallback;
  }
};

const PartnerThemeTool = () => {
  const [globals, updateGlobals] = useGlobals();
  const [items, setItems] = useState<PartnerThemeToolbarItem[]>([
    { value: NO_PARTNER_THEME_UID, title: 'None' },
  ]);

  useEffect(() => {
    void loadPartnerThemeToolbarItems().then(setItems);
  }, []);

  const selected =
    (globals?.partnerTheme as string | undefined) ?? NO_PARTNER_THEME_UID;

  const options = useMemo(
    () =>
      items.map((item) => ({
        title: item.title,
        value: item.value,
      })),
    [items],
  );

  const selectedTitle =
    items.find((item) => item.value === selected)?.title ?? 'None';

  return (
    <Select
      ariaLabel="Partner theme"
      tooltip="Partner theme"
      defaultOptions={[selected]}
      options={options}
      showSelectedOptionTitle
      icon={<PaintBrushIcon />}
      onSelect={(value) => updateGlobals({ partnerTheme: value as string })}
    >
      {selectedTitle}
    </Select>
  );
};

addons.register(ADDON_ID, () => {
  addons.add(`${ADDON_ID}/tool`, {
    type: types.TOOL,
    title: 'Partner theme',
    match: ({ viewMode }) => viewMode === 'story',
    render: PartnerThemeTool,
  });
});
