import type { PartnerThemesData } from '@/types/strapi';
import type { ConfigThemeStates } from '@/types/theme';
import { isDarkOrLightThemeMode } from '@/utils/formatTheme';
import {
  PARTNER_COLOR_MODE_STORAGE_KEY,
  THEME_COLOR_SCHEME_STORAGE_KEY,
  THEME_MODE_STORAGE_KEY,
} from './constants';

export const resolveSelectedMenuPartnerTheme = (
  configThemeStates: ConfigThemeStates,
  partnerThemes: PartnerThemesData[],
): PartnerThemesData | undefined => {
  for (const [uid, state] of Object.entries(configThemeStates)) {
    if (!state.isSelected) {
      continue;
    }

    const theme = partnerThemes.find((t) => t.uid === uid);
    if (theme?.SelectableInMenu && theme.PartnerName) {
      return theme;
    }
  }

  return undefined;
};

const applyColorSchemeToDocument = (colorScheme: 'light' | 'dark') => {
  const root = document.documentElement;
  const dark =
    localStorage.getItem(`${THEME_COLOR_SCHEME_STORAGE_KEY}-dark`) || 'dark';
  const light =
    localStorage.getItem(`${THEME_COLOR_SCHEME_STORAGE_KEY}-light`) || 'light';

  root.classList.remove('light', 'dark', light, dark);
  root.classList.add(colorScheme);
  root.setAttribute('data-mui-color-scheme', colorScheme);
  root.style.colorScheme = colorScheme === dark ? 'dark' : 'light';
};

export const clearPartnerColorModeOverride = () => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(PARTNER_COLOR_MODE_STORAGE_KEY);
};

/** Apply partner light/dark before MUI mounts — avoids post-hydration mode flicker. */
export const applySelectedPartnerColorMode = (
  configThemeStates: ConfigThemeStates,
  partnerThemes: PartnerThemesData[],
) => {
  if (typeof window === 'undefined') {
    return;
  }

  const selectedPartner = resolveSelectedMenuPartnerTheme(
    configThemeStates,
    partnerThemes,
  );

  if (!selectedPartner) {
    clearPartnerColorModeOverride();
    return;
  }

  const colorMode = isDarkOrLightThemeMode(selectedPartner);
  localStorage.setItem(PARTNER_COLOR_MODE_STORAGE_KEY, colorMode);
  localStorage.setItem(THEME_MODE_STORAGE_KEY, colorMode);
  applyColorSchemeToDocument(colorMode);
};
