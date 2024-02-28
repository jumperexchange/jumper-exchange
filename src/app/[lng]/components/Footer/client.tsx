'use client';

import { useContext } from 'react';
import { ClientTranslationContext, useClientTranslation } from 'src/i18n';
import { FooterBase } from './FooterBase';

export function Footer({ path }: { path: string }) {
  const { i18n } = useClientTranslation('footer');
  const { lng } = useContext(ClientTranslationContext);
  return <FooterBase i18n={i18n} lng={lng} path={path} />;
}
