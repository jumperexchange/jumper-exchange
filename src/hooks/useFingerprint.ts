'use client';
import { useEffect, useState } from 'react';

export const useFingerprint = () => {
  const [fingerprint, setFingerprint] = useState<string>();
  // Create a new ClientJS object

  useEffect(() => {
    // Get the client's fingerprint id;
    const newFingerprint = 'abcd';
    console.log(newFingerprint);
    setFingerprint(`${newFingerprint}`);
  }, []);

  return fingerprint;
};
