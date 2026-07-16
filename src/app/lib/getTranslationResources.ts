import initTranslations from '@/app/i18n';
import type { Resource } from 'i18next';
import { cacheLife } from 'next/cache';

const TRANSLATION_RESOURCES_REVALIDATE_SECONDS = 300;

export async function getTranslationResources(
  locale: string,
  namespaces: string[],
): Promise<Resource> {
  'use cache';
  cacheLife({ revalidate: TRANSLATION_RESOURCES_REVALIDATE_SECONDS });
  const { resources } = await initTranslations(locale, namespaces);
  return resources;
}
