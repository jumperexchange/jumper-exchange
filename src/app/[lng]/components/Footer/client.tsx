'use client';

import { ClientTranslationContext } from '@/i18n/i18next-client-provider';
import { useClientTranslation } from '@/i18n/useClientTranslation';
import { useContext } from 'react';
import { FooterBase } from './FooterBase';

export function Footer({ path }: { path: string }) {
  const { i18n } = useClientTranslation('footer');
  const { lng } = useContext(ClientTranslationContext);
  return <FooterBase i18n={i18n} lng={lng} path={path} />;
}
