import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { AppPaths } from 'src/const/urls';

export const useGoBack = (fallbackPath: AppPaths) => {
  const router = useRouter();
  const handleGoBack = useCallback(() => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackPath);
    }
  }, []);
  return handleGoBack;
};
