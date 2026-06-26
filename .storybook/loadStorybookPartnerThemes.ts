import { NO_PARTNER_THEME_UID } from './partnerThemeConstants.ts';

export interface PartnerThemeToolbarItem {
  value: string;
  title: string;
}

export async function loadStorybookPartnerThemes(): Promise<
  PartnerThemeToolbarItem[]
> {
  const items: PartnerThemeToolbarItem[] = [
    { value: NO_PARTNER_THEME_UID, title: 'None' },
  ];

  try {
    const base =
      process.env.NEXT_PUBLIC_STRAPI_URL || 'https://strapi.jumper.xyz';
    const url = new URL(`${base}/api/partner-themes`);
    url.searchParams.set('pagination[pageSize]', '50');
    url.searchParams.set('populate[0]', 'BackgroundImageLight');
    url.searchParams.set('populate[1]', 'BackgroundImageDark');
    url.searchParams.set('populate[2]', 'LogoLight');
    url.searchParams.set('populate[3]', 'LogoDark');

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Strapi responded with ${response.status}`);
    }

    const result = await response.json();
    const themes: Array<{
      uid?: string;
      PartnerName?: string;
      SelectableInMenu?: boolean;
    }> = result.data ?? [];

    for (const theme of themes) {
      if (!theme.uid || !theme.PartnerName || !theme.SelectableInMenu) {
        continue;
      }

      if (items.some((item) => item.value === theme.uid)) {
        continue;
      }

      items.push({ value: theme.uid, title: theme.PartnerName });
    }
  } catch (error) {
    console.warn(
      '[Storybook] Failed to load partner themes for toolbar',
      error,
    );
  }

  return items;
}
