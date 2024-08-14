'use client';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { useEffect, useMemo, useRef } from 'react';

export const useFingerprint = () => {
  const loadedRef = useRef(sessionStorage.getItem('fpId') || false);
  console.log('useFingerPrint');
  useEffect(() => {
    async function load() {
      if (!loadedRef.current) {
        const fp = await FingerprintJS.load();
        const response = await fp.get();
        loadedRef.current = response.visitorId;
        sessionStorage.setItem('fpId', response.visitorId);
      }
    }

    if (!loadedRef.current) {
      load();
    }
  }, []);

  return useMemo(() => loadedRef.current, []);
};
