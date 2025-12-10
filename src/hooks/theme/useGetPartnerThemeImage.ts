import { useThemeStore } from 'src/stores/theme';
import { useThemeConditionsMet } from './useThemeConditionsMet';

export const useGetPartnerThemeImage = () => {
  const configTheme = useThemeStore((state) => state.configTheme);
  const { shouldShowForTheme, shouldShowForPath } = useThemeConditionsMet();

  const imageUrl =
    shouldShowForPath && shouldShowForTheme
      ? configTheme?.backgroundImageUrl?.href
      : null;

  return imageUrl;
};
