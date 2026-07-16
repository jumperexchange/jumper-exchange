import { useThemeStore } from 'src/stores/theme';
import { useThemeConditionsMet } from './useThemeConditionsMet';

export const useGetPartnerThemeImage = () => {
  const configTheme = useThemeStore((state) => state.configTheme);
  const { shouldShowForTheme } = useThemeConditionsMet();

  if (!shouldShowForTheme) {
    return { url: null, mime: null };
  }

  return {
    url: configTheme?.backgroundImageUrl?.href ?? null,
    mime: configTheme?.backgroundImageMime ?? null,
  };
};
