import { useEffect, useState } from 'react';
import { uuidv7 } from 'uuidv7';

export const useSession = (): string | undefined => {
  let sessionIdFromStorage: string | false | null = null; // Initialize with a default value

  // Check if sessionStorage is available
  if (typeof window !== 'undefined') {
    sessionIdFromStorage =
      typeof sessionStorage !== 'undefined' &&
      sessionStorage.getItem('session_id');
  }

  const [session, setSession] = useState<string | undefined>('');

  useEffect(() => {
    if (sessionIdFromStorage) {
      setSession(sessionIdFromStorage);
    } else {
      const newSessionId = uuidv7();
      setSession(newSessionId);

      // Ensure sessionStorage is available before setting item
      if (
        typeof window !== 'undefined' &&
        typeof sessionStorage !== 'undefined'
      ) {
        sessionStorage.setItem('session_id', newSessionId);
      }
    }

    // Log the session ID for testing purposes
  }, [session, sessionIdFromStorage, setSession]);

  return session;
};
