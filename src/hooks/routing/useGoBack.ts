import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { AppPaths } from 'src/const/urls';

export const useGoBack = (fallbackPath: AppPaths) => {
  const router = useRouter();
  const handleGoBack = useCallback(() => {
    const referrer = document.referrer;
    const isInternalNavigation =
      referrer && new URL(referrer).origin === window.location.origin;

    if (isInternalNavigation) {
      router.back();
    } else {
      router.push(fallbackPath);
    }
  }, []);
  return handleGoBack;
};
