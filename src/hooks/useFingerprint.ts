'use client';
import getBrowserFingerprint from 'get-browser-fingerprint';
import { useEffect, useState } from 'react';

export const useFingerprint = () => {
  const [fingerprint, setFingerprint] = useState<string>();
  // Create a new ClientJS object

  useEffect(() => {
    // Get the client's fingerprint id
    const fingerprint = getBrowserFingerprint({});
    console.log(fingerprint);
    setFingerprint(`${fingerprint}`);
  }, []);

  return fingerprint;
};
