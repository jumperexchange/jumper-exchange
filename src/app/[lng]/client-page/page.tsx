'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useClientTranslation } from 'src/i18n';

import { Trans } from 'react-i18next';
import { useTranslation } from '../../../i18n';

export const FooterBase = ({ t, lng }) => {
  return (
    <footer style={{ marginTop: 50 }}>
      <Trans i18nKey="navbar.welcome.subtitle" t={t}>
        Switch from <strong>{{ lng }}</strong> to:{' '}
      </Trans>
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
    </footer>
  );
};

export const Footer = async ({ lng }) => {
  const { t } = await useTranslation(lng, 'footer');
  return <FooterBase t={t} lng={lng} />;
};

export default function Page({ params: { lng } }) {
  const { t } = useClientTranslation(lng, 'client-page');
  const [counter, setCounter] = useState(0);
  return (
    <>
      <h1>{t('title')}</h1>
      <p>{t('counter', { count: counter })}</p>
      <div>
        <button onClick={() => setCounter(Math.max(0, counter - 1))}>-</button>
        <button onClick={() => setCounter(Math.min(10, counter + 1))}>+</button>
      </div>
      <Link href={`/${lng}`}>
        <button type="button">{t('back-to-home')}</button>
      </Link>
      <Footer lng={lng} />
    </>
  );
}
