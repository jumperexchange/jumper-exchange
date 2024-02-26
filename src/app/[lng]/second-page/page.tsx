import Link from 'next/link';
import { useTranslation } from 'src/i18n/i18n';

export default async function Page({ params: { lng } }) {
  const { t } = await useTranslation(lng);
  return (
    <>
      <h1>{t('navbar.welcome.title')}</h1>
      <Link href={`/${lng}`}>Second: {t('navbar.welcome.subtitle')}</Link>
    </>
  );
}
