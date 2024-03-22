import { useState, useEffect, createContext, ReactNode } from 'react';
import { useCookies } from 'react-cookie';

type ContextValue = {
  clientId: string;
  sessionId: string;
};

const DEFAULT_STATE = {
  clientId: '',
  sessionId: '',
};

// Use context so we can share our state wherever we collect events
export const EventCollectorContext = createContext<ContextValue>(DEFAULT_STATE);

const COOKIE_NAME_GA = '_ga'; // set by gtag/ga to store their client id
const COOKIE_NAME_CLIENT_ID = '_event_collector_client_id';
const COOKIE_NAME_SESSION_ID = '_event_collector_session_id';

export const EventCollectorProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [cookies, setCookie] = useCookies();
  // state to be shared via context
  const [value, setValue] = useState<ContextValue>(DEFAULT_STATE);

  useEffect(() => {
    // store clientId in our own cookie
    setCookie(COOKIE_NAME_CLIENT_ID, value.clientId, {
      expires: new Date(Date.now() + 2592000), // 30 days
    });
  }, [value.clientId]);

  useEffect(() => {
    // store session Id in our own cookie
    setCookie(COOKIE_NAME_SESSION_ID, value.sessionId);
  }, [value.sessionId]);

  useEffect(() => {
    // client Id
    if (cookies[COOKIE_NAME_GA]) {
      // if we have a client Id from ga, use it
      setValue((prev) => ({
        ...prev,
        clientId: cookies[COOKIE_NAME_GA].substring(6),
      }));
    } else if (cookies[COOKIE_NAME_CLIENT_ID]) {
      // if we already have our own client Id, use it
      setValue((prev) => ({
        ...prev,
        clientId: cookies[COOKIE_NAME_CLIENT_ID],
      }));
    } else {
      // otherwise create our own in the same format as GA
      // a more robust implementation here might be to hash some user device info together like IP + device + browser + screen resolution etc.
      setValue((prev) => ({
        ...prev,
        clientId: `ANON__USER.${Math.random().toString().slice(2, 12)}`,
      }));
    }

    // session Id
    // TODO can we grab the one from GA if available?
    if (cookies[COOKIE_NAME_SESSION_ID]) {
      // if we already have our own session Id, use it
      setValue((prev) => ({
        ...prev,
        sessionId: cookies[COOKIE_NAME_SESSION_ID],
      }));
    } else {
      // otherwise create a new one
      setValue((prev) => ({
        ...prev,
        sessionId: String(Math.floor(Date.now() / 1000)),
      }));
    }
  }, []);

  return (
    <EventCollectorContext.Provider value={value}>
      {children}
    </EventCollectorContext.Provider>
  );
};
