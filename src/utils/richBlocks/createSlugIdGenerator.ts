import { slugify } from '@/utils/urls/slugify';

export type SlugIdGenerator = (text: string) => string;

export function createSlugIdGenerator(): SlugIdGenerator {
  return (text: string): string => {
    const base = slugify(text);
    return base;
  };
}
