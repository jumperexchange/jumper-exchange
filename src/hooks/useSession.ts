'use client';
import { useEffect, useState } from 'react';
import { v7 as uuidv7 } from 'uuid';

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
      sessionStorage.setItem('session_id', newSessionId);
    }
  }, [session]);

  return session;
};
