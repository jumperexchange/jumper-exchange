import { fallbackLng, languages, useServerTranslation } from 'src/i18n';

export default async function Head({
  params: { lng },
}: {
  params: {
    lng: string;
  };
}) {
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng;
  }
  const { t } = await useServerTranslation(lng);

  return (
    <>
      <title>{t('title')}</title>
      <meta
        name="description"
        content="A playground to explore new Next.js 13 app directory features such as nested layouts, instant loading states, streaming, and component level data fetching."
      />
    </>
  );
}
