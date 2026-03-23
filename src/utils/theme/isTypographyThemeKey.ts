import type { Theme } from '@mui/material/styles';
import type { TypographyProps } from '@mui/material/Typography';

export type TypographyVariantKey = TypographyProps['variant'];

export type TypographyThemeKey = Exclude<
  TypographyVariantKey,
  'inherit' | undefined | `@${string}` | ((...args: any[]) => any)
>;

const isTypographyThemeKey = (
  theme: Theme,
  variant: TypographyVariantKey,
): variant is TypographyThemeKey =>
  !!variant &&
  variant !== 'inherit' &&
  typeof variant !== 'function' &&
  !variant.startsWith('@') &&
  variant in theme.typography;

export const getTypographyStyles = (
  theme: Theme,
  variant: TypographyVariantKey,
  fallback: TypographyThemeKey,
) => {
  const key = isTypographyThemeKey(theme, variant) ? variant : fallback;
  return theme.typography[key];
};
