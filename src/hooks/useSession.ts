'use client';
import { useEffect, useState } from 'react';
import { v7 as uuidv7 } from 'uuid';

export const useSession = (): string => {
  const [session, setSession] = useState<string>(() => {
    if (
      typeof window !== 'undefined' &&
      typeof sessionStorage !== 'undefined'
    ) {
      return sessionStorage.getItem('session_id') || uuidv7();
    }
    return uuidv7();
  });

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      typeof sessionStorage !== 'undefined'
    ) {
      sessionStorage.setItem('session_id', session);
      setSession(session);
    }
  }, [session]);

  return session;
};
