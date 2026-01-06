import type { RuntimeConfig } from '@/config/env-config';
import { AppPaths } from '@/const/urls';
import { stripLocaleFromPathname } from '@/utils/urls/stripLocaleFromPathname';

export const getPathBasedIntegrator = (
  pathname: string | null | undefined,
  config: RuntimeConfig,
): string => {
  const normalizedPathname = pathname
    ? stripLocaleFromPathname(pathname)
    : null;

  const earnRelatedPaths = [AppPaths.Earn, AppPaths.Portfolio];
  const isEarnRelatedPath = earnRelatedPaths.some(
    (path) =>
      normalizedPathname === path || normalizedPathname?.startsWith(path + '/'),
  );

  return isEarnRelatedPath
    ? config.NEXT_PUBLIC_WIDGET_INTEGRATOR_EARN
    : config.NEXT_PUBLIC_WIDGET_INTEGRATOR;
};
