'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { AppPaths } from 'src/const/urls';
import { useSdkConfigStore } from 'src/stores/sdkConfig/SDKConfigStore';

export const RouteListenerProvider = () => {
  const pathname = usePathname();
  const { configType, setConfigType } = useSdkConfigStore();
  const previousPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (previousPathRef.current === pathname) return;

    if (pathname.includes(AppPaths.Zap) && configType !== 'zap') {
      setConfigType('zap');
    } else if (!pathname.includes(AppPaths.Zap) && configType === 'zap') {
      setConfigType('default');
    }

    previousPathRef.current = pathname;
  }, [pathname, configType, setConfigType]);

  return null;
};
