'use client';
import { ClientJS } from 'clientjs';
import { useEffect, useState } from 'react';

export const useFingerprint = () => {
  const [fingerprint, setFingerprint] = useState<string>();
  // Create a new ClientJS object

  useEffect(() => {
    // Get the client's fingerprint id
    const client = new ClientJS();
    const fingerprint = client.getFingerprint();
    setFingerprint(`${fingerprint}`);
  }, []);

  return fingerprint;
};
