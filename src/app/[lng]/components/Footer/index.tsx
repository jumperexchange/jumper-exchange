import { useServerTranslation } from 'src/i18n';
import { FooterBase } from './FooterBase';

export const Footer = async ({ lng, path }: { lng: string; path?: string }) => {
  const { t, i18n } = await useServerTranslation(lng, 'footer');
  return <FooterBase i18n={i18n} lng={lng} path={path} />;
};
