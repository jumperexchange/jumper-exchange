import { EarnHeroCardCopyKey } from './HeroEarnCard';

export const ithCopy = (index: number): EarnHeroCardCopyKey => {
  const values = Object.values(EarnHeroCardCopyKey);
  const safeIndex = (index + values.length) % values.length;
  return values[safeIndex] as EarnHeroCardCopyKey;
};
