'use client';

import Link from 'next/link';
import { useState } from 'react';
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
  const { t } = useClientTranslation();
  // const { t } = useTranslation();
  const [counter, setCounter] = useState(0);
  return (
    <>
      <main>
        <Header heading={t('navbar.welcome.title')} />
        <p>
          {t('counter', { count: counter })} - {counter}
        </p>
        <div>
          <button onClick={() => setCounter(Math.max(0, counter - 1))}>
            -
          </button>
          <button onClick={() => setCounter(Math.min(10, counter + 1))}>
            +
          </button>
        </div>
        <Link href={`/${lng}/second-client-page`}>
          {t('to-second-client-page')}
        </Link>
        <Link href={`/${lng}`}>
          <button type="button">{t('back-to-home')}</button>
        </Link>
      </main>
      <Footer path="/client-page" />
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
