'use client';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { useEffect, useState } from 'react';

export const useFingerprint = () => {
  const [fingerprint, setFingerprint] = useState<string | undefined>(() => {
    if (
      typeof window !== 'undefined' &&
      typeof sessionStorage !== 'undefined'
    ) {
      return sessionStorage.getItem('fpId') || undefined;
    }
    return undefined;
  });

  useEffect(() => {
    async function load() {
      const fp = await FingerprintJS.load();
      const response = await fp.get().then((el) => el);
      setFingerprint(response.visitorId);
      sessionStorage.setItem('fpId', response.visitorId);
    }

    load();
  }, []);

  return fingerprint;
};
