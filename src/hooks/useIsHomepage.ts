import { usePathname } from 'next/navigation';
import {
  JUMPER_BUY_PATH,
  JUMPER_EXCHANGE_PATH,
  JUMPER_GAS_PATH,
  JUMPER_REFUEL_PATH,
  JUMPER_SWAP_PATH,
} from 'src/const/urls';
import { locales } from 'src/i18n';

const checkLocaleIsPath = (path: string | null) => {
  if (path) {
    return locales.some(
      (locale) =>
        path === '/' ||
        path.includes(`${JUMPER_BUY_PATH}`) ||
        path.includes(`${JUMPER_GAS_PATH}`) ||
        path.includes(`${JUMPER_REFUEL_PATH}`) ||
        path.includes(`${JUMPER_SWAP_PATH}`) ||
        path.includes(`${JUMPER_EXCHANGE_PATH}`) ||
        path === `/${locale}` ||
        path === `/${locale}/` ||
        path.includes(`/${locale}${JUMPER_BUY_PATH}`) ||
        path.includes(`/${locale}${JUMPER_GAS_PATH}`) ||
        path.includes(`/${locale}${JUMPER_REFUEL_PATH}`) ||
        path.includes(`/${locale}${JUMPER_SWAP_PATH}`) ||
        path.includes(`/${locale}${JUMPER_EXCHANGE_PATH}`),
    );
  }
};

export const useIsHomepage = () => {
  const pathname = usePathname();
  const isHomepage = checkLocaleIsPath(pathname);
  return isHomepage;
};
