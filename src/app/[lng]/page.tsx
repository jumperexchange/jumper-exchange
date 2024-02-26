import Link from 'next/link';
import { useTranslation } from 'src/i18n/i18n';
import { languages } from 'src/i18n/i18n-settings';

export default async function Page({ params: { lng } }) {
  const { t } = await useTranslation(lng);

  return (
    <>
      <h1>{t('navbar.welcome.title')}</h1>
      <Link href={`/${lng}/second-page`}>First: {t('navbar.welcome.cta')}</Link>
      {languages
        .filter((l) => lng !== l)
        .map((l, index) => {
          return (
            <span key={l}>
              {index > 0 && ' or '}
              <Link href={`/${l}`}>{l}</Link>
            </span>
          );
        })}
      <Link href={`/${lng}/client-page`}>
        Client Page:{t('to-client-page')}
      </Link>
    </>
  );
}
