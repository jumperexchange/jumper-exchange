import config from '@/config/env-config';
import { AppPaths } from '@/const/urls';

export const getPathBasedIntegrator = (pathname?: string | null): string => {
  const earnRelatedPaths = [AppPaths.Earn, AppPaths.Portfolio];
  const isEarnRelatedPath = earnRelatedPaths.some((path) =>
    pathname?.includes(path),
  );
  return isEarnRelatedPath
    ? config.NEXT_PUBLIC_WIDGET_INTEGRATOR_EARN
    : config.NEXT_PUBLIC_WIDGET_INTEGRATOR;
};
