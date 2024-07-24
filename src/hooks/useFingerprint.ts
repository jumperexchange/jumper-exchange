'use client';
import { useEffect, useState } from 'react';

export const useFingerprint = () => {
  const [fingerprint, setFingerprint] = useState<string>();

  useEffect(() => {
    // Get the client's fingerprint id;
    // const newFingerprint = 'abcd';
    // console.log(newFingerprint);
    // setFingerprint(`${newFingerprint}`);
  }, []);

  return fingerprint;
};
