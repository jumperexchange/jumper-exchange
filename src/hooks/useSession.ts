import { useEffect, useRef } from 'react';
import { uuidv7 } from 'uuidv7';

export const useSession = (): string => {
  const sessionIdRef = useRef<string>('');

  useEffect(() => {
    let sessionId = sessionStorage.getItem('session_id');

    if (!sessionId) {
      sessionId = uuidv7();
      sessionStorage.setItem('session_id', sessionId);
      console.log('Init Session ID:', sessionId);
    }

    sessionIdRef.current = sessionId;

    // Log the session ID for testing purposes
  }, []);

  return sessionIdRef.current;
};
