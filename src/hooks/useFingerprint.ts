'use client';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { useEffect } from 'react';
import { DEFAULT_FP } from 'src/config/config';
import { useFpStore } from 'src/stores/fp';

export const useFingerprint = () => {
  const [fp, setFp] = useFpStore((state) => [state.fp, state.setFp]);

  useEffect(() => {
    async function load() {
      const fp = await FingerprintJS.load();
      const response = await fp.get();
      setFp(response.visitorId);
    }
    if (fp === DEFAULT_FP) {
      load();
    }
  }, [fp, setFp]);

  return fp;
};
