import Link from 'next/link';
import { useServerTranslation } from 'src/i18n';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

export default async function Page({
  params: { lng },
}: {
  params: {
    lng: string;
  };
}) {
  const { t } = await useServerTranslation(lng, 'second-page');
  return (
    <>
      <main>
        <Header heading={t('h1')} />
        <Link href={`/${lng}`}>
          <button type="button">{t('back-to-home')}</button>
        </Link>
      </main>
      <Footer lng={lng} path="/second-page" />
    </>
  );
}
