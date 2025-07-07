'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { AppPaths } from 'src/const/urls';
import {
  ConfigType,
  useSdkConfigStore,
} from 'src/stores/sdkConfig/SDKConfigStore';

export const RouteListenerProvider = () => {
  const pathname = usePathname();
  const { configType, setConfigType } = useSdkConfigStore();
  const previousPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (previousPathRef.current === pathname) return;

    if (pathname.includes(AppPaths.Zap) && configType !== ConfigType.Zap) {
      setConfigType(ConfigType.Zap);
    } else if (
      !pathname.includes(AppPaths.Zap) &&
      configType === ConfigType.Zap
    ) {
      setConfigType(ConfigType.Default);
    }

    previousPathRef.current = pathname;
  }, [pathname, configType, setConfigType]);

  return null;
};
