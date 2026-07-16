'use client';
import { useEffect, useState } from 'react';
import { v7 as uuidv7 } from 'uuid';

export const useSession = (): string => {
  const [session, setSession] = useState<string>(() => {
    if (
      typeof window !== 'undefined' &&
      typeof sessionStorage !== 'undefined'
    ) {
      return sessionStorage.getItem('session_id') ?? '';
    }
    return '';
  });

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      typeof sessionStorage !== 'undefined'
    ) {
      const sessionId =
        session || sessionStorage.getItem('session_id') || uuidv7();
      sessionStorage.setItem('session_id', sessionId);
      if (sessionId !== session) {
        setSession(sessionId);
      }
    }
  }, [session]);

  return session;
};
