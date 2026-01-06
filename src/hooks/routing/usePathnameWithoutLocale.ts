import { usePathname } from 'next/navigation';
import { stripLocaleFromPathname } from '@/utils/urls/stripLocaleFromPathname';

export const usePathnameWithoutLocale = () => {
  const pathname = usePathname();
  return stripLocaleFromPathname(pathname);
};
