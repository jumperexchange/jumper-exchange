'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '../navigation';

export const LanguageChanger = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  console.log('locale', locale);
  const handleChange = (e: any) => {
    console.log('OLD PATHNAME', pathname);
    router.push(pathname, { locale: e.target.value });
  };

  return (
    <select value={locale} onChange={handleChange}>
      <option value="en">English</option>
      <option value="fr">Francaise</option>
      <option value="es">Español</option>
      <option value="ja" disabled>
        日本語
      </option>
    </select>
  );
};
