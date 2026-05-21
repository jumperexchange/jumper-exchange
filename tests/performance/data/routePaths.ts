/** Locale-prefixed app paths for missions and earn (benchmarks + e2e POMs). */
export const missionsEarnPaths = {
  earnDetail: (locale: string, slug: string): string =>
    `/${locale}/earn/${slug}`,
  earnIndex: (locale: string): string => `/${locale}/earn`,
  missionDetail: (locale: string, slug: string): string =>
    `/${locale}/missions/${slug}`,
  missionsIndex: (locale: string): string => `/${locale}/missions`,
} as const;

export const parseSlugFromHref = (
  href: string,
  segment: 'earn' | 'missions',
): null | string => {
  try {
    const url = new URL(href, 'http://localhost');
    const parts = url.pathname.split('/').filter(Boolean);
    const index = parts.indexOf(segment);
    if (index === -1 || index === parts.length - 1) {
      return null;
    }
    const slug = parts[index + 1];
    return slug.length > 0 ? slug : null;
  } catch {
    return null;
  }
};
