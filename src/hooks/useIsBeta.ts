'use client';
import { useEffect, useState } from 'react';
import { isBeta } from '@/utils/isBeta';

/**
 * Client hook mirroring {@link isBeta} — whether the `use-beta` localStorage
 * flag is set. Returns `false` on the server and the first client render, then
 * resolves after mount to avoid hydration mismatches.
 */
export const useIsBeta = (): boolean => {
  const [beta, setBeta] = useState(false);

  useEffect(() => {
    setBeta(isBeta());
  }, []);

  return beta;
};
