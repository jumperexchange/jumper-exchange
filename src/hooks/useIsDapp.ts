import { usePathname } from 'next/navigation';
import { JUMPER_LEARN_PATH, JUMPER_LOYALTY_PATH } from 'src/const/urls';
import { locales } from 'src/i18n';

const checkLocaleIsPath = (path: string | null) => {
  if (path) {
    return locales.some(
      (locale) =>
        !path.includes(`${JUMPER_LEARN_PATH}`) ||
        !path.includes(`${JUMPER_LOYALTY_PATH}`),
    );
  }
};

export const useIsDapp = () => {
  const pathname = usePathname();
  const isHomepage = checkLocaleIsPath(pathname);
  return isHomepage;
};
