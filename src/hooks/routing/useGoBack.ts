import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useSearchParamsStorageFor } from '../../stores/earn/SearchParamsStore';
import { type AppPaths } from '@/const/urls';

export const useGoBack = (fallbackPath: AppPaths) => {
  const router = useRouter();
  const lastSearchParams = useSearchParamsStorageFor(fallbackPath);
  const handleGoBack = useCallback(() => {
    const referrer = document.referrer;
    const isInternalNavigation =
      referrer && new URL(referrer).origin === window.location.origin;
    if (isInternalNavigation) {
      router.back();
    } else {
      const queryString = lastSearchParams ? `?${lastSearchParams}` : '';
      router.push(`${fallbackPath}${queryString}`);
    }
  }, [lastSearchParams, fallbackPath, router]);
  return handleGoBack;
};
