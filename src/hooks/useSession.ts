'use client';
import { useEffect, useState } from 'react';
import { uuidv7 } from 'uuidv7';

export const useSession = (): string | undefined => {
  const [session, setSession] = useState<string | undefined>(() => {
    if (
      typeof window !== 'undefined' &&
      typeof sessionStorage !== 'undefined'
    ) {
      return sessionStorage.getItem('session_id') || undefined;
    }
    return undefined;
  });

  useEffect(() => {
    if (!session) {
      const newSessionId = uuidv7();
      setSession(newSessionId);

      if (
        typeof window !== 'undefined' &&
        typeof sessionStorage !== 'undefined'
      ) {
        sessionStorage.setItem('session_id', newSessionId);
      }
    }
  }, [session]);

  return session;
};
