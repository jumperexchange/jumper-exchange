'use client';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { DEFAULT_FP } from 'src/config/config';

interface FingerprintContextProps {
  fp: 'unknown' | string;
  isLoading: boolean;
}

export const FingerprintContext = createContext<FingerprintContextProps>({
  fp: DEFAULT_FP,
  isLoading: true,
});

export const FingerprintProvider: FC<PropsWithChildren> = ({ children }) => {
  const [fp, setFp] = useState(DEFAULT_FP);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load the fingerprint once
    async function loadFingerprint() {
      const fpInstance = await FingerprintJS.load();
      const response = await fpInstance.get();
      setFp(response.visitorId);
      setIsLoading(false);
    }

    if (fp === DEFAULT_FP) {
      loadFingerprint();
    }
  }, [fp]);
  return (
    <FingerprintContext.Provider value={{ fp, isLoading }}>
      {children}
    </FingerprintContext.Provider>
  );
};

// Custom hook to use the fingerprint context
export const useFingerprint = () => {
  return useContext(FingerprintContext);
};
