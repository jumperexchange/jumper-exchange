'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { isAddress } from 'viem';
import { useReferrerStore } from '@/stores/referrer/ReferrerStore';

/**
 * Captures the referral ID from the URL (?ref=0x...) once per session and stores it.
 * Mount this once in the root layout so widgets can read the referrer from the store
 * without each running URL/searchParams logic.
 */
export function ReferrerCapture() {
  const searchParams = useSearchParams();
  const referrer = useReferrerStore((state) => state.referrer);
  const setReferrer = useReferrerStore((state) => state.setReferrer);

  useEffect(() => {
    if (referrer) {
      return;
    }

    const refFromUrl = searchParams.get('ref');
    if (refFromUrl) {
      const trimmed = refFromUrl.trim();
      if (isAddress(trimmed)) {
        setReferrer(trimmed);
      }
    }
  }, [referrer, searchParams, setReferrer]);

  return null;
}
