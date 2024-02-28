'use client';

import Link from 'next/link';
import { ClientTranslationProvider, useClientTranslation } from 'src/i18n';
import { Footer } from '../components/Footer/client';
import { Header } from '../components/Header';

function PageContent({
  params: { lng },
}: {
  params: {
    lng: string;
  };
}) {
  const { t } = useClientTranslation('second-client-page');
  return (
    <>
      <main>
        <Header heading={t('h1')} />
        <Link href={`/${lng}`}>
          <button type="button">{t('back-to-home')}</button>
        </Link>
      </main>
      <Footer path="/second-client-page" />
    </>
  );
}

export default function Page({
  params,
}: {
  params: {
    lng: string;
  };
}) {
  return (
    <ClientTranslationProvider lng={params.lng}>
      <PageContent params={params}></PageContent>
    </ClientTranslationProvider>
  );
}
