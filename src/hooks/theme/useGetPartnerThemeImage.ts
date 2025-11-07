import { useThemeStore } from 'src/stores/theme';
import { useThemeConditionsMet } from './useThemeConditionsMet';

export const useGetPartnerThemeImage = () => {
  const configTheme = useThemeStore((state) => state.configTheme);
  const isThemeConditionsMet = useThemeConditionsMet();

  console.log(
    'configTheme?.backgroundImageUrl',
    configTheme?.backgroundImageUrl,
  );

  const imageUrl = isThemeConditionsMet
    ? configTheme?.backgroundImageUrl?.href
    : null;

  return imageUrl;
};
