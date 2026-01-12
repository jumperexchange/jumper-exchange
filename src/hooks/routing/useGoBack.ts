import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { AppPaths } from 'src/const/urls';
import { useEarnSearchParamsStorage } from '../../stores/earn/useStoreQueryStates';

export const useGoBack = (fallbackPath: AppPaths) => {
  const router = useRouter();
  const { query: lastEarnQuery } = useEarnSearchParamsStorage();
  const handleGoBack = useCallback(() => {
    const referrer = document.referrer;
    const isInternalNavigation =
      referrer && new URL(referrer).origin === window.location.origin;
    if (isInternalNavigation) {
      router.back();
    } else {
      if (fallbackPath === AppPaths.Earn) {
        const queryString = lastEarnQuery ? `?${lastEarnQuery}` : '';
        router.push(`${fallbackPath}${queryString}`);
        return;
      }
      router.push(fallbackPath);
    }
  }, []);
  return handleGoBack;
};
